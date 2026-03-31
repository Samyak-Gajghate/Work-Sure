// Shared TypeScript interfaces and types for Work-Sure backend

export type UserRole = 'Admin' | 'Manager' | 'Member';
export type TaskStatus = 'Todo' | 'InProgress' | 'InReview' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type NotificationType = 'task_assigned' | 'task_status_changed' | 'comment_added' | 'task_reassigned';

// JWT payload attached to req.user after auth middleware
export interface AuthUser {
  id: string;
  role: UserRole;
}

// DB row types (raw from pg query results)
export interface UserRow {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  role?: UserRole;          // joined from workspace_members
  joined_at?: Date;         // joined from workspace_members
}

export interface WorkspaceRow {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
  member_count?: number;    // computed
}

export interface WorkspaceMemberRow {
  id: string;
  workspace_id: string;
  user_id: string;
  role_id: number;
  joined_at: Date;
  removed_at: Date | null;
  role_name?: UserRole;     // joined from roles
}

export interface TaskRow {
  id: string;
  workspace_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  assignee_full_name?: string;
  created_by_full_name?: string;
}

export interface CommentRow {
  id: string;
  task_id: string;
  author_id: string;
  content: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
  author_full_name?: string; // joined
}

export interface NotificationRow {
  id: string;
  user_id: string;
  type: NotificationType;
  message: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: Date;
}

export interface ActivityLogRow {
  id: string;
  task_id: string | null;
  actor_id: string;
  action: string;
  old_value: string | null;
  new_value: string | null;
  created_at: Date;
  actor_full_name?: string; // joined
}

export interface RefreshTokenRow {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: Date;
  revoked: boolean;
  created_at: Date;
}

export interface RoleRow {
  id: number;
  name: UserRole;
  created_at: Date;
}

// Express request augmentation
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
