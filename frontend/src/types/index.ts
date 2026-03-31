// Shared TypeScript interfaces for Work-Sure frontend

export type UserRole = 'Admin' | 'Manager' | 'Member';
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NotificationType = 'task_assigned' | 'task_status_changed' | 'comment_added' | 'task_reassigned';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active?: boolean;
  joined_at?: string;
  created_at?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  assignee?: { id: string; full_name: string } | null;
  created_by: { id: string; full_name: string };
  created_at: string;
  updated_at: string;
}

export interface TaskDetail extends Task {
  comments: Comment[];
  activity: ActivityLog[];
}

export interface Comment {
  id: string;
  content: string;
  author: { id: string; full_name: string };
  created_at: string;
  updated_at?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  actor: { id: string; full_name: string };
  created_at: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface PersonalDashboard {
  total_tasks: number;
  open_tasks: number;
  due_today: number;
  overdue: number;
  done: number;
}

export interface TeamDashboard {
  total_tasks: number;
  by_status: Record<TaskStatus, number>;
  overdue: number;
}

export interface WorkspaceStats {
  total_tasks: number;
  open_tasks: number;
  completed: number;
  overdue: number;
  total_members: number;
  tasks_by_member: Array<{ user: { id: string; full_name: string }; count: number }>;
}
