import { pool } from '../../config/db';

export async function getPersonalDashboard(userId: string) {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE assignee_id = $1 AND deleted_at IS NULL) as total_tasks,
       COUNT(*) FILTER (WHERE assignee_id = $1 AND deleted_at IS NULL AND status != 'Done') as open_tasks,
       COUNT(*) FILTER (WHERE assignee_id = $1 AND deleted_at IS NULL AND due_date = CURRENT_DATE) as due_today,
       COUNT(*) FILTER (WHERE assignee_id = $1 AND deleted_at IS NULL AND due_date < CURRENT_DATE AND status != 'Done') as overdue,
       COUNT(*) FILTER (WHERE assignee_id = $1 AND deleted_at IS NULL AND status = 'Done') as done
     FROM tasks`,
    [userId]
  );
  const row = rows[0];
  return {
    total_tasks: parseInt(row.total_tasks, 10),
    open_tasks: parseInt(row.open_tasks, 10),
    due_today: parseInt(row.due_today, 10),
    overdue: parseInt(row.overdue, 10),
    done: parseInt(row.done, 10),
  };
}

export async function getTeamDashboard() {
  const { rows } = await pool.query(
    `SELECT
       COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_tasks,
       COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'Todo') as todo,
       COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'InProgress') as in_progress,
       COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'InReview') as in_review,
       COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'Done') as done,
       COUNT(*) FILTER (WHERE deleted_at IS NULL AND due_date < CURRENT_DATE AND status != 'Done') as overdue
     FROM tasks`
  );
  const row = rows[0];
  return {
    total_tasks: parseInt(row.total_tasks, 10),
    by_status: {
      Todo: parseInt(row.todo, 10),
      InProgress: parseInt(row.in_progress, 10),
      InReview: parseInt(row.in_review, 10),
      Done: parseInt(row.done, 10),
    },
    overdue: parseInt(row.overdue, 10),
  };
}

export async function getWorkspaceStats() {
  const [totalsRes, membersRes, perMemberRes] = await Promise.all([
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE deleted_at IS NULL) as total_tasks,
         COUNT(*) FILTER (WHERE deleted_at IS NULL AND status = 'Done') as completed,
         COUNT(*) FILTER (WHERE deleted_at IS NULL AND status != 'Done') as open_tasks,
         COUNT(*) FILTER (WHERE deleted_at IS NULL AND due_date < CURRENT_DATE AND status != 'Done') as overdue
       FROM tasks`
    ),
    pool.query('SELECT COUNT(*) FROM workspace_members WHERE removed_at IS NULL'),
    pool.query(
      `SELECT u.id, u.full_name, COUNT(t.id) as task_count
       FROM users u
       LEFT JOIN tasks t ON t.assignee_id = u.id AND t.deleted_at IS NULL
       JOIN workspace_members wm ON wm.user_id = u.id AND wm.removed_at IS NULL
       GROUP BY u.id, u.full_name
       ORDER BY task_count DESC`
    ),
  ]);

  const row = totalsRes.rows[0];
  return {
    total_tasks: parseInt(row.total_tasks, 10),
    open_tasks: parseInt(row.open_tasks, 10),
    completed: parseInt(row.completed, 10),
    overdue: parseInt(row.overdue, 10),
    total_members: parseInt(membersRes.rows[0].count, 10),
    tasks_by_member: perMemberRes.rows.map((r) => ({
      user: { id: r.id, full_name: r.full_name },
      count: parseInt(r.task_count, 10),
    })),
  };
}
