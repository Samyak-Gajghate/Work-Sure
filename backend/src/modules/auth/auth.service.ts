import { pool } from '../../config/db';
import { hashPassword, comparePassword, hashToken } from '../../utils/hash';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError, unauthorized, conflict, notFound } from '../../utils/errors';
import { UserRole } from '../../types';
import { RegisterInput, LoginInput } from './auth.schema';
import { v4 as uuidv4 } from 'uuid';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface AuthResult extends AuthTokens {
  user: {
    id: string;
    full_name: string;
    email: string;
    role: UserRole;
  };
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

async function issueTokens(userId: string, role: UserRole): Promise<AuthTokens> {
  const accessToken = signAccessToken({ sub: userId, role });
  const refreshToken = signRefreshToken({ sub: userId });
  const tokenHash = hashToken(refreshToken);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, addDays(7)]
  );

  return { access_token: accessToken, refresh_token: refreshToken };
}

async function getWorkspace(): Promise<string | null> {
  const { rows } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  return rows[0]?.id ?? null;
}

async function getUserRole(userId: string, workspaceId: string): Promise<UserRole> {
  const { rows } = await pool.query(
    `SELECT r.name FROM workspace_members wm
     JOIN roles r ON wm.role_id = r.id
     WHERE wm.user_id = $1 AND wm.workspace_id = $2 AND wm.removed_at IS NULL`,
    [userId, workspaceId]
  );
  return (rows[0]?.name ?? 'Member') as UserRole;
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  // Check if email already exists
  const { rows: existing } = await pool.query(
    'SELECT id FROM users WHERE email = $1',
    [input.email]
  );
  if (existing.length > 0) {
    throw conflict('Email is already registered');
  }

  const passwordHash = await hashPassword(input.password);

  // Check if first user (becomes Admin)
  const { rows: userCount } = await pool.query('SELECT COUNT(*) as count FROM users');
  const isFirstUser = parseInt(userCount[0].count, 10) === 0;

  // Create user
  const { rows: [user] } = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email`,
    [input.full_name, input.email, passwordHash]
  );

  let role: UserRole = 'Member';

  if (isFirstUser) {
    // First user: create workspace + assign Admin role
    role = 'Admin';
    const { rows: [workspace] } = await pool.query(
      `INSERT INTO workspaces (name, description, created_by)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Work-Sure Workspace', 'Default workspace', user.id]
    );

    // Get Admin role id
    const { rows: [adminRole] } = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      ['Admin']
    );

    await pool.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role_id)
       VALUES ($1, $2, $3)`,
      [workspace.id, user.id, adminRole.id]
    );
  } else {
    // Subsequent users: add as Member to existing workspace
    const workspaceId = await getWorkspace();
    if (workspaceId) {
      const { rows: [memberRole] } = await pool.query(
        'SELECT id FROM roles WHERE name = $1',
        ['Member']
      );
      await pool.query(
        `INSERT INTO workspace_members (workspace_id, user_id, role_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (workspace_id, user_id) DO NOTHING`,
        [workspaceId, user.id, memberRole.id]
      );
    }
    role = 'Member';
  }

  const tokens = await issueTokens(user.id, role);

  return {
    user: { id: user.id, full_name: user.full_name, email: user.email, role },
    ...tokens,
  };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, password_hash, is_active, deleted_at FROM users WHERE email = $1',
    [input.email]
  );

  const user = rows[0];
  if (!user || user.deleted_at || !user.is_active) {
    throw unauthorized('Invalid email or password');
  }

  const isValid = await comparePassword(input.password, user.password_hash);
  if (!isValid) {
    throw unauthorized('Invalid email or password');
  }

  // Get role from workspace
  const workspaceId = await getWorkspace();
  const role: UserRole = workspaceId ? await getUserRole(user.id, workspaceId) : 'Member';

  const tokens = await issueTokens(user.id, role);

  return {
    user: { id: user.id, full_name: user.full_name, email: user.email, role },
    ...tokens,
  };
}

export async function refresh(rawRefreshToken: string): Promise<AuthTokens> {
  // Verify JWT signature first
  let payload: { sub: string };
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw unauthorized('Invalid or expired refresh token');
  }

  // Look up hashed token in DB
  const tokenHash = hashToken(rawRefreshToken);
  const { rows } = await pool.query(
    `SELECT id, user_id, revoked, expires_at
     FROM refresh_tokens
     WHERE token_hash = $1`,
    [tokenHash]
  );

  const stored = rows[0];
  if (!stored || stored.revoked || stored.expires_at < new Date()) {
    throw unauthorized('Refresh token is expired or revoked');
  }

  // Revoke old token
  await pool.query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [stored.id]);

  // Get current role
  const workspaceId = await getWorkspace();
  const role: UserRole = workspaceId ? await getUserRole(stored.user_id, workspaceId) : 'Member';

  // Issue new tokens
  return issueTokens(stored.user_id, role);
}

export async function logout(rawRefreshToken: string): Promise<void> {
  const tokenHash = hashToken(rawRefreshToken);
  await pool.query(
    'UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1',
    [tokenHash]
  );
}

export async function getMe(userId: string): Promise<object> {
  const { rows } = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.created_at, r.name as role
     FROM users u
     LEFT JOIN workspace_members wm ON wm.user_id = u.id AND wm.removed_at IS NULL
     LEFT JOIN roles r ON r.id = wm.role_id
     WHERE u.id = $1 AND u.deleted_at IS NULL
     LIMIT 1`,
    [userId]
  );

  if (!rows[0]) {
    throw notFound('User');
  }

  return rows[0];
}
