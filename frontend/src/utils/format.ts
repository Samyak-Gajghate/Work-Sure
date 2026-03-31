import type { TaskStatus, TaskPriority } from '../types';

export function getStatusColor(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    Todo: 'bg-gray-100 text-gray-700',
    InProgress: 'bg-blue-100 text-blue-700',
    InReview: 'bg-yellow-100 text-yellow-700',
    Done: 'bg-green-100 text-green-700',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}

export function getPriorityColor(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    Low: 'bg-gray-100 text-gray-600',
    Medium: 'bg-blue-100 text-blue-700',
    High: 'bg-orange-100 text-orange-700',
    Critical: 'bg-red-100 text-red-700',
  };
  return map[priority] ?? 'bg-gray-100 text-gray-600';
}

export function getStatusLabel(status: TaskStatus): string {
  const map: Record<TaskStatus, string> = {
    Todo: 'To Do',
    InProgress: 'In Progress',
    InReview: 'In Review',
    Done: 'Done',
  };
  return map[status] ?? status;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function extractApiError(error: unknown): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const res = (error as { response?: { data?: { error?: { message?: string }; message?: string } } }).response;
    return res?.data?.error?.message ?? res?.data?.message ?? 'An error occurred';
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}
