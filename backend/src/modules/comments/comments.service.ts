import { pool } from '../../config/db';
import { notFound, forbidden } from '../../utils/errors';
import { UserRole } from '../../types';
import { CreateCommentInput, UpdateCommentInput } from './comments.schema';

const MAX_EDIT_HOURS = 24;

async function createNotification(userId: string, type: string, message: string, referenceId: string) {
  await pool.query(
    `INSERT INTO notifications (user_id, type, message, reference_id) VALUES ($1, $2, $3, $4)`,
    [userId, type, message, referenceId]
  );
}

async function logActivity(taskId: string, actorId: string, action: string, oldValue?: string, newValue?: string) {
  await pool.query(
    `INSERT INTO activity_logs (task_id, actor_id, action, old_value, new_value) VALUES ($1, $2, $3, $4, $5)`,
    [taskId, actorId, action, oldValue ?? null, newValue ?? null]
  );
}

export async function createComment(taskId: string, input: CreateCommentInput, authorId: string) {
  // Verify task exists
  const { rows: [task] } = await pool.query(
    'SELECT id, assignee_id, created_by, title FROM tasks WHERE id = $1 AND deleted_at IS NULL',
    [taskId]
  );
  if (!task) throw notFound('Task');

  const { rows: [comment] } = await pool.query(
    `INSERT INTO comments (task_id, author_id, content) VALUES ($1, $2, $3)
     RETURNING id, content, created_at, updated_at`,
    [taskId, authorId, input.content]
  );

  await logActivity(taskId, authorId, 'comment_added', undefined, input.content.slice(0, 100));

  // Notify task assignee and creator (if not the commenter)
  const { rows: [author] } = await pool.query('SELECT full_name FROM users WHERE id = $1', [authorId]);
  const notifyUsers = [task.assignee_id, task.created_by].filter(Boolean).filter((id: string) => id !== authorId);
  for (const userId of notifyUsers) {
    await createNotification(
      userId, 'comment_added',
      `${author.full_name} commented on "${task.title}"`,
      taskId
    );
  }

  const { rows: [authorData] } = await pool.query('SELECT id, full_name FROM users WHERE id = $1', [authorId]);
  return { ...comment, task_id: taskId, author: authorData };
}

export async function updateComment(
  taskId: string, commentId: string, input: UpdateCommentInput, userId: string
) {
  const { rows: [comment] } = await pool.query(
    'SELECT id, author_id, content, created_at FROM comments WHERE id = $1 AND task_id = $2 AND deleted_at IS NULL',
    [commentId, taskId]
  );
  if (!comment) throw notFound('Comment');
  if (comment.author_id !== userId) throw forbidden('You can only edit your own comments');

  // 24-hour edit window
  const hoursSinceCreated = (Date.now() - new Date(comment.created_at).getTime()) / 3600000;
  if (hoursSinceCreated > MAX_EDIT_HOURS) {
    throw forbidden('Comment can no longer be edited (24-hour window expired)');
  }

  const { rows: [updated] } = await pool.query(
    'UPDATE comments SET content = $1 WHERE id = $2 RETURNING id, content, created_at, updated_at',
    [input.content, commentId]
  );

  const { rows: [authorData] } = await pool.query('SELECT id, full_name FROM users WHERE id = $1', [userId]);
  return { ...updated, task_id: taskId, author: authorData };
}

export async function deleteComment(
  taskId: string, commentId: string, userId: string, role: UserRole
) {
  const { rows: [comment] } = await pool.query(
    'SELECT id, author_id FROM comments WHERE id = $1 AND task_id = $2 AND deleted_at IS NULL',
    [commentId, taskId]
  );
  if (!comment) throw notFound('Comment');

  if (comment.author_id !== userId && role !== 'Admin') {
    throw forbidden('You can only delete your own comments');
  }

  await pool.query('UPDATE comments SET deleted_at = NOW() WHERE id = $1', [commentId]);
  await logActivity(taskId, userId, 'comment_deleted', comment.author_id, undefined);
}
