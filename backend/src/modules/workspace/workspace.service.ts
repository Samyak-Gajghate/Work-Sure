import { pool } from '../../config/db';
import { notFound, forbidden } from '../../utils/errors';
import { UpdateWorkspaceInput } from './workspace.schema';
import { parsePagination, buildPagination } from '../../utils/paginate';
import { Request } from 'express';

export async function getWorkspace() {
  const { rows } = await pool.query(
    `SELECT w.id, w.name, w.description, w.created_at,
       (SELECT COUNT(*) FROM workspace_members WHERE workspace_id = w.id AND removed_at IS NULL) as member_count
     FROM workspaces w LIMIT 1`
  );
  if (!rows[0]) throw notFound('Workspace');
  return rows[0];
}

export async function updateWorkspace(input: UpdateWorkspaceInput) {
  const { rows: [ws] } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (!ws) throw notFound('Workspace');

  const updates: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (input.name !== undefined) { updates.push(`name = $${i++}`); params.push(input.name); }
  if (input.description !== undefined) { updates.push(`description = $${i++}`); params.push(input.description); }

  if (updates.length === 0) return getWorkspace();

  params.push(ws.id);
  await pool.query(`UPDATE workspaces SET ${updates.join(', ')} WHERE id = $${i}`, params);
  return getWorkspace();
}

export async function getWorkspaceMembers(query: Request['query']) {
  const { rows: [ws] } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (!ws) throw notFound('Workspace');

  const { page, limit, offset } = parsePagination(query);
  const [countRes, dataRes] = await Promise.all([
    pool.query(
      'SELECT COUNT(*) FROM workspace_members WHERE workspace_id = $1 AND removed_at IS NULL',
      [ws.id]
    ),
    pool.query(
      `SELECT u.id, u.full_name, u.email, r.name as role, wm.joined_at
       FROM workspace_members wm
       JOIN users u ON u.id = wm.user_id
       JOIN roles r ON r.id = wm.role_id
       WHERE wm.workspace_id = $1 AND wm.removed_at IS NULL
       ORDER BY wm.joined_at ASC
       LIMIT $2 OFFSET $3`,
      [ws.id, limit, offset]
    ),
  ]);

  return {
    data: dataRes.rows,
    pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit),
  };
}
