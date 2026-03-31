import { format, formatDistanceToNow, isToday, isPast, parseISO } from 'date-fns';

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy');
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d, yyyy h:mm a');
}

export function isDueDateOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  const d = parseISO(dueDate);
  return isPast(d) && !isToday(d);
}

export function isDueToday(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;
  return isToday(parseISO(dueDate));
}
