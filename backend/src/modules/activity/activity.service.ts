import { pool } from '../../config/db';
import { notFound, forbidden } from '../../utils/errors';
import { parsePagination, buildPagination } from '../../utils/paginate';
import { UserRole } from '../../types';
import { Request } from 'express';

export async function getTaskActivity(taskId: string, userId: string, role: UserRole, query: Request['query']) {
  // Member: verify they have access to this task
  if (role === 'Member') {
    const { rows: [task] } = await pool.query(
      'SELECT assignee_id FROM tasks WHERE id = $1 AND deleted_at IS NULL',
      [taskId]
    );
    if (!task) throw notFound('Task');
    if (task.assignee_id !== userId) throw forbidden('Access denied');
  }

  const { page, limit, offset } = parsePagination(query);

  const [countRes, dataRes] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM activity_logs WHERE task_id = $1', [taskId]),
    pool.query(
      `SELECT al.id, al.action, al.old_value, al.new_value, al.created_at,
         u.id as actor_id, u.full_name as actor_full_name
       FROM activity_logs al JOIN users u ON u.id = al.actor_id
       WHERE al.task_id = $1
       ORDER BY al.created_at ASC
       LIMIT $2 OFFSET $3`,
      [taskId, limit, offset]
    ),
  ]);

  const data = dataRes.rows.map((r) => ({
    id: r.id, action: r.action, old_value: r.old_value, new_value: r.new_value,
    created_at: r.created_at,
    actor: { id: r.actor_id, full_name: r.actor_full_name },
  }));

  return { data, pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit) };
}

export async function getWorkspaceActivity(query: Request['query']) {
  const { page, limit, offset } = parsePagination(query);

  const [countRes, dataRes] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM activity_logs'),
    pool.query(
      `SELECT al.id, al.task_id, al.action, al.old_value, al.new_value, al.created_at,
         u.id as actor_id, u.full_name as actor_full_name
       FROM activity_logs al JOIN users u ON u.id = al.actor_id
       ORDER BY al.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
  ]);

  const data = dataRes.rows.map((r) => ({
    id: r.id, task_id: r.task_id, action: r.action, old_value: r.old_value,
    new_value: r.new_value, created_at: r.created_at,
    actor: { id: r.actor_id, full_name: r.actor_full_name },
  }));

  return { data, pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit) };
}
