import { pool } from '../../config/db';
import { notFound, forbidden } from '../../utils/errors';
import { parsePagination, buildPagination } from '../../utils/paginate';
import { Request } from 'express';

export async function getMyNotifications(userId: string, query: Request['query']) {
  const { page, limit, offset } = parsePagination(query);

  const [countRes, dataRes] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM notifications WHERE user_id = $1', [userId]),
    pool.query(
      `SELECT id, type, message, reference_id, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY is_read ASC, created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    ),
  ]);

  return {
    data: dataRes.rows,
    pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit),
  };
}

export async function markAsRead(notificationId: string, userId: string) {
  const { rows: [notif] } = await pool.query(
    'SELECT id, user_id FROM notifications WHERE id = $1',
    [notificationId]
  );
  if (!notif) throw notFound('Notification');
  if (notif.user_id !== userId) throw forbidden('This notification does not belong to you');

  await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [notificationId]);
}

export async function markAllAsRead(userId: string) {
  const { rowCount } = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE',
    [userId]
  );
  return { updated: rowCount ?? 0 };
}
