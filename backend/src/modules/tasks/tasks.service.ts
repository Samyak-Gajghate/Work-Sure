import { pool } from '../../config/db';
import { notFound, forbidden, invalidReference, invalidStatusTransition } from '../../utils/errors';
import { parsePagination, buildPagination } from '../../utils/paginate';
import { UserRole, TaskStatus } from '../../types';
import { CreateTaskInput, UpdateTaskInput } from './tasks.schema';
import { Request } from 'express';

// Valid status transitions
const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo: ['InProgress'],
  InProgress: ['InReview'],
  InReview: ['Done', 'InProgress'],
  Done: [],
};

async function getWorkspaceId(): Promise<string> {
  const { rows } = await pool.query('SELECT id FROM workspaces LIMIT 1');
  if (!rows[0]) throw notFound('Workspace');
  return rows[0].id;
}

async function isMemberOfWorkspace(userId: string, workspaceId: string): Promise<boolean> {
  const { rows } = await pool.query(
    'SELECT id FROM workspace_members WHERE workspace_id = $1 AND user_id = $2 AND removed_at IS NULL',
    [workspaceId, userId]
  );
  return rows.length > 0;
}

async function logActivity(
  taskId: string,
  actorId: string,
  action: string,
  oldValue?: string | null,
  newValue?: string | null
): Promise<void> {
  await pool.query(
    `INSERT INTO activity_logs (task_id, actor_id, action, old_value, new_value)
     VALUES ($1, $2, $3, $4, $5)`,
    [taskId, actorId, action, oldValue ?? null, newValue ?? null]
  );
}

async function createNotification(
  userId: string,
  type: string,
  message: string,
  referenceId: string
): Promise<void> {
  await pool.query(
    `INSERT INTO notifications (user_id, type, message, reference_id)
     VALUES ($1, $2, $3, $4)`,
    [userId, type, message, referenceId]
  );
}

function buildTaskQuery(
  workspaceId: string,
  role: UserRole,
  userId: string,
  query: Request['query']
): { sql: string; countSql: string; params: unknown[]; countParams: unknown[] } {
  const conditions: string[] = ['t.workspace_id = $1', 't.deleted_at IS NULL'];
  const params: unknown[] = [workspaceId];
  let i = 2;

  if (role === 'Member') {
    conditions.push(`t.assignee_id = $${i++}`);
    params.push(userId);
  }

  if (query.status) { conditions.push(`t.status = $${i++}`); params.push(query.status); }
  if (query.priority) { conditions.push(`t.priority = $${i++}`); params.push(query.priority); }
  if (query.assignee_id) { conditions.push(`t.assignee_id = $${i++}`); params.push(query.assignee_id); }
  if (query.search) { conditions.push(`t.title ILIKE $${i++}`); params.push(`%${query.search}%`); }

  const where = `WHERE ${conditions.join(' AND ')}`;

  const validSortFields: Record<string, string> = {
    created_at: 't.created_at', due_date: 't.due_date', priority: 't.priority',
  };
  const sortField = validSortFields[String(query.sort ?? 'created_at')] ?? 't.created_at';
  const order = query.order === 'asc' ? 'ASC' : 'DESC';

  const countSql = `SELECT COUNT(*) FROM tasks t ${where}`;
  const countParams = [...params];

  const sql = `
    SELECT t.id, t.title, t.status, t.priority, t.due_date, t.created_at, t.updated_at,
      a.id as assignee_id, a.full_name as assignee_full_name,
      c.id as created_by_id, c.full_name as created_by_full_name
    FROM tasks t
    LEFT JOIN users a ON a.id = t.assignee_id
    LEFT JOIN users c ON c.id = t.created_by
    ${where}
    ORDER BY ${sortField} ${order}
    LIMIT $${i++} OFFSET $${i}`;
  
  return { sql, countSql, params, countParams };
}

export async function listTasks(query: Request['query'], userId: string, role: UserRole) {
  const workspaceId = await getWorkspaceId();
  const { page, limit, offset } = parsePagination(query);

  const { sql, countSql, params: baseParams, countParams } = buildTaskQuery(workspaceId, role, userId, query);
  const params = [...baseParams, limit, offset];

  const [countRes, dataRes] = await Promise.all([
    pool.query(countSql, countParams),
    pool.query(sql, params),
  ]);

  const tasks = dataRes.rows.map((r) => ({
    id: r.id, title: r.title, status: r.status, priority: r.priority,
    due_date: r.due_date, created_at: r.created_at, updated_at: r.updated_at,
    assignee: r.assignee_id ? { id: r.assignee_id, full_name: r.assignee_full_name } : null,
    created_by: { id: r.created_by_id, full_name: r.created_by_full_name },
  }));

  return { data: tasks, pagination: buildPagination(parseInt(countRes.rows[0].count, 10), page, limit) };
}

export async function createTask(input: CreateTaskInput, creatorId: string) {
  const workspaceId = await getWorkspaceId();

  // Validate assignee is workspace member
  if (input.assignee_id) {
    const isMember = await isMemberOfWorkspace(input.assignee_id, workspaceId);
    if (!isMember) throw invalidReference('Assignee is not a workspace member');
  }

  const { rows: [task] } = await pool.query(
    `INSERT INTO tasks (workspace_id, title, description, priority, assignee_id, created_by, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, status, priority, assignee_id, created_by, due_date, created_at, updated_at`,
    [workspaceId, input.title, input.description ?? null, input.priority, input.assignee_id ?? null, creatorId, input.due_date ?? null]
  );

  await logActivity(task.id, creatorId, 'task_created', null, input.title);

  // Notify assignee
  if (input.assignee_id && input.assignee_id !== creatorId) {
    const { rows: [creator] } = await pool.query('SELECT full_name FROM users WHERE id = $1', [creatorId]);
    await createNotification(
      input.assignee_id,
      'task_assigned',
      `${creator.full_name} assigned you: ${input.title}`,
      task.id
    );
  }

  return getTaskById(task.id, creatorId, 'Admin');
}

export async function getTaskById(taskId: string, userId: string, role: UserRole): Promise<object> {
  const { rows: [task] } = await pool.query(
    `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.created_at, t.updated_at,
       a.id as assignee_id, a.full_name as assignee_full_name,
       c.id as created_by_id, c.full_name as created_by_full_name
     FROM tasks t
     LEFT JOIN users a ON a.id = t.assignee_id
     LEFT JOIN users c ON c.id = t.created_by
     WHERE t.id = $1 AND t.deleted_at IS NULL`,
    [taskId]
  );

  if (!task) throw notFound('Task');

  // Members can only see assigned tasks
  if (role === 'Member' && task.assignee_id !== userId) {
    throw forbidden('You can only view tasks assigned to you');
  }

  const [commentsRes, activityRes] = await Promise.all([
    pool.query(
      `SELECT cm.id, cm.content, cm.created_at, cm.updated_at, u.id as author_id, u.full_name as author_full_name
       FROM comments cm JOIN users u ON u.id = cm.author_id
       WHERE cm.task_id = $1 AND cm.deleted_at IS NULL
       ORDER BY cm.created_at ASC`,
      [taskId]
    ),
    pool.query(
      `SELECT al.id, al.action, al.old_value, al.new_value, al.created_at, u.id as actor_id, u.full_name as actor_full_name
       FROM activity_logs al JOIN users u ON u.id = al.actor_id
       WHERE al.task_id = $1
       ORDER BY al.created_at ASC`,
      [taskId]
    ),
  ]);

  return {
    id: task.id, title: task.title, description: task.description,
    status: task.status, priority: task.priority, due_date: task.due_date,
    assignee: task.assignee_id ? { id: task.assignee_id, full_name: task.assignee_full_name } : null,
    created_by: { id: task.created_by_id, full_name: task.created_by_full_name },
    created_at: task.created_at, updated_at: task.updated_at,
    comments: commentsRes.rows.map((r) => ({
      id: r.id, content: r.content, created_at: r.created_at,
      author: { id: r.author_id, full_name: r.author_full_name },
    })),
    activity: activityRes.rows.map((r) => ({
      id: r.id, action: r.action, old_value: r.old_value,
      new_value: r.new_value, created_at: r.created_at,
      actor: { id: r.actor_id, full_name: r.actor_full_name },
    })),
  };
}

export async function updateTask(taskId: string, input: UpdateTaskInput, userId: string) {
  const workspaceId = await getWorkspaceId();
  const { rows: [task] } = await pool.query(
    'SELECT id, title, assignee_id FROM tasks WHERE id = $1 AND deleted_at IS NULL',
    [taskId]
  );
  if (!task) throw notFound('Task');

  if (input.assignee_id) {
    const isMember = await isMemberOfWorkspace(input.assignee_id, workspaceId);
    if (!isMember) throw invalidReference('Assignee is not a workspace member');
  }

  const updates: string[] = [];
  const params: unknown[] = [];
  let i = 1;

  if (input.title !== undefined) { updates.push(`title = $${i++}`); params.push(input.title); }
  if (input.description !== undefined) { updates.push(`description = $${i++}`); params.push(input.description); }
  if (input.priority !== undefined) { updates.push(`priority = $${i++}`); params.push(input.priority); }
  if (input.due_date !== undefined) { updates.push(`due_date = $${i++}`); params.push(input.due_date); }
  if (input.assignee_id !== undefined) { updates.push(`assignee_id = $${i++}`); params.push(input.assignee_id); }

  if (updates.length === 0) return getTaskById(taskId, userId, 'Admin');

  params.push(taskId);
  await pool.query(
    `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${i}`,
    params
  );

  await logActivity(taskId, userId, 'task_updated', task.title, input.title ?? task.title);

  // If assignee changed, send notification
  if (input.assignee_id !== undefined && input.assignee_id !== task.assignee_id) {
    const { rows: [updater] } = await pool.query('SELECT full_name FROM users WHERE id = $1', [userId]);
    const { rows: [updatedTask] } = await pool.query('SELECT title FROM tasks WHERE id = $1', [taskId]);
    if (input.assignee_id && input.assignee_id !== userId) {
      await createNotification(
        input.assignee_id,
        'task_reassigned',
        `${updater.full_name} assigned you: ${updatedTask.title}`,
        taskId
      );
    }
    await logActivity(taskId, userId, 'assignee_changed',
      task.assignee_id ?? 'Unassigned',
      input.assignee_id ?? 'Unassigned'
    );
  }

  return getTaskById(taskId, userId, 'Admin');
}

export async function updateTaskStatus(
  taskId: string,
  newStatus: TaskStatus,
  userId: string,
  role: UserRole
): Promise<object> {
  const { rows: [task] } = await pool.query(
    'SELECT id, title, status, assignee_id, created_by FROM tasks WHERE id = $1 AND deleted_at IS NULL',
    [taskId]
  );
  if (!task) throw notFound('Task');

  // Members can only update assigned tasks
  if (role === 'Member' && task.assignee_id !== userId) {
    throw forbidden('You can only update status of tasks assigned to you');
  }

  // Validate transition
  const allowed = STATUS_TRANSITIONS[task.status as TaskStatus];
  if (!allowed.includes(newStatus)) {
    throw invalidStatusTransition(task.status, newStatus);
  }

  await pool.query('UPDATE tasks SET status = $1 WHERE id = $2', [newStatus, taskId]);

  // Record status history
  await pool.query(
    `INSERT INTO task_status_history (task_id, changed_by, old_status, new_status)
     VALUES ($1, $2, $3, $4)`,
    [taskId, userId, task.status, newStatus]
  );

  await logActivity(taskId, userId, 'status_changed', task.status, newStatus);

  // Notify task creator and assignee
  const { rows: [changer] } = await pool.query('SELECT full_name FROM users WHERE id = $1', [userId]);
  const notifyUsers = [task.created_by, task.assignee_id].filter(Boolean).filter((id) => id !== userId);
  for (const notifyId of notifyUsers) {
    await createNotification(
      notifyId,
      'task_status_changed',
      `${changer.full_name} changed status of "${task.title}" to ${newStatus}`,
      taskId
    );
  }

  return getTaskById(taskId, userId, 'Admin');
}

export async function deleteTask(taskId: string, userId: string): Promise<void> {
  const { rows: [task] } = await pool.query(
    'SELECT id, title FROM tasks WHERE id = $1 AND deleted_at IS NULL',
    [taskId]
  );
  if (!task) throw notFound('Task');

  await pool.query('UPDATE tasks SET deleted_at = NOW() WHERE id = $1', [taskId]);
  await logActivity(taskId, userId, 'task_deleted', task.title, null);
}
