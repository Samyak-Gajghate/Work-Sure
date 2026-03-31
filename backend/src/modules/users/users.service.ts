import { pool } from '../../config/db';
import { hashPassword, comparePassword } from '../../utils/hash';
import { conflict, notFound, forbidden, invalidReference } from '../../utils/errors';
import { parsePagination, buildPagination } from '../../utils/paginate';
import { UserRole } from '../../types';
import { InviteUserInput, UpdateRoleInput, UpdateProfileInput } from './users.schema';
import { Request } from 'express';

async function getWorkspaceId(): Promise<string> {
  const { rows } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (!rows[0]) throw notFound('Workspace');
  return rows[0].id;
}

export async function getAllUsers(query: Request['query']) {
  const workspaceId = await getWorkspaceId();
  const { page, limit, offset } = parsePagination(query);
  const search = query.search ? `%${query.search}%` : null;

  const where = search
    ? `wm.workspace_id = $1 AND wm.removed_at IS NULL AND (u.full_name ILIKE $4 OR u.email ILIKE $4)`
    : `wm.workspace_id = $1 AND wm.removed_at IS NULL`;

  const params = search
    ? [workspaceId, limit, offset, search]
    : [workspaceId, limit, offset];

  const [countRes, dataRes] = await Promise.all([
    pool.query(
      `SELECT COUNT(*) FROM workspace_members wm JOIN users u ON u.id = wm.user_id WHERE ${where}`,
      search ? [workspaceId, search] : [workspaceId]
    ),
    pool.query(
      `SELECT u.id, u.full_name, u.email, u.is_active, r.name as role, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON u.id = wm.user_id
       JOIN roles r ON r.id = wm.role_id
       WHERE ${where}
       ORDER BY wm.joined_at DESC
       LIMIT $2 OFFSET $3`,
      params
    ),
  ]);

  return {
    data: dataRes.rows,
    pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit),
  };
}

export async function inviteUser(input: InviteUserInput) {
  const workspaceId = await getWorkspaceId();

  // Check if email already in use
  const { rows: existing } = await pool.query('SELECT id FROM users WHERE email = $1', [input.email]);
  let userId: string;

  if (existing.length > 0) {
    userId = existing[0].id;
    // Check if already in workspace
    const { rows: member } = await pool.query(
      'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND removed_at IS NULL',
      [workspaceId, userId]
    );
    if (member.length > 0) throw conflict('User is already a workspace member');
  } else {
    // Create user with temporary password
    const tempPassword = await hashPassword('TempPass@123');
    const { rows: [newUser] } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id`,
      [input.full_name, input.email, tempPassword]
    );
    userId = newUser.id;
  }

  const { rows: [role] } = await pool.query('SELECT id FROM roles WHERE name = $1', [input.role]);
  await pool.query(
    `INSERT INTO workspace_members (workspace_id, user_id, role_id)
     VALUES ($1, $2, $3)
     ON CONFLICT (workspace_id, user_id) DO UPDATE SET role_id = $3, removed_at = NULL`,
    [workspaceId, userId, role.id]
  );

  const { rows: [user] } = await pool.query(
    `SELECT u.id, u.full_name, u.email, r.name as role, wm.joined_at
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     JOIN roles r ON r.id = wm.role_id
     WHERE wm.workspace_id = $1 AND wm.user_id = $2`,
    [workspaceId, userId]
  );
  return user;
}

export async function updateUserRole(targetUserId: string, input: UpdateRoleInput, requesterId: string) {
  if (targetUserId === requesterId) throw forbidden('You cannot change your own role');

  const workspaceId = await getWorkspaceId();
  const { rows: [role] } = await pool.query('SELECT id FROM roles WHERE name = $1', [input.role]);

  const { rows: [member] } = await pool.query(
    'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND removed_at IS NULL',
    [workspaceId, targetUserId]
  );
  if (!member) throw notFound('User');

  await pool.query(
    'UPDATE workspace_members SET role_id = $1 WHERE workspace_id = $2 AND user_id = $3',
    [role.id, workspaceId, targetUserId]
  );

  const { rows: [updated] } = await pool.query(
    `SELECT u.id, u.full_name, u.email, r.name as role FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id JOIN roles r ON r.id = wm.role_id
     WHERE wm.workspace_id = $1 AND wm.user_id = $2`,
    [workspaceId, targetUserId]
  );
  return updated;
}

export async function removeUser(targetUserId: string, requesterId: string) {
  if (targetUserId === requesterId) throw forbidden('You cannot remove yourself');

  const workspaceId = await getWorkspaceId();

  // Prevent removing last Admin
  const { rows: adminCount } = await pool.query(
    `SELECT COUNT(*) as count FROM workspace_members wm JOIN roles r ON r.id = wm.role_id
     WHERE wm.workspace_id = $1 AND r.name = 'Admin' AND wm.removed_at IS NULL`,
    [workspaceId]
  );
  const { rows: [targetMember] } = await pool.query(
    `SELECT r.name as role FROM workspace_members wm JOIN roles r ON r.id = wm.role_id
     WHERE wm.workspace_id = $1 AND wm.user_id = $2 AND wm.removed_at IS NULL`,
    [workspaceId, targetUserId]
  );

  if (!targetMember) throw notFound('User');
  if (targetMember.role === 'Admin' && parseInt(adminCount[0].count, 10) <= 1) {
    throw forbidden('Cannot remove the last Admin from the workspace');
  }

  await pool.query(
    'UPDATE workspace_members SET removed_at = NOW() WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, targetUserId]
  );
  await pool.query('UPDATE users SET is_active = FALSE WHERE id = $1', [targetUserId]);
}

export async function getProfile(userId: string) {
  const { rows: [user] } = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.created_at, r.name as role
     FROM users u
     LEFT JOIN workspace_members wm ON wm.user_id = u.id AND wm.removed_at IS NULL
     LEFT JOIN roles r ON r.id = wm.role_id
     WHERE u.id = $1 AND u.deleted_at IS NULL`,
    [userId]
  );
  if (!user) throw notFound('User');
  return user;
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const updates: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (input.full_name) {
    updates.push(`full_name = $${paramIndex++}`);
    params.push(input.full_name);
  }

  if (input.current_password && input.new_password) {
    const { rows: [user] } = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    const valid = await comparePassword(input.current_password, user.password_hash);
    if (!valid) throw forbidden('Current password is incorrect');
    const newHash = await hashPassword(input.new_password);
    updates.push(`password_hash = $${paramIndex++}`);
    params.push(newHash);
  }

  if (updates.length === 0) return getProfile(userId);

  params.push(userId);
  await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    params
  );
  return getProfile(userId);
}
