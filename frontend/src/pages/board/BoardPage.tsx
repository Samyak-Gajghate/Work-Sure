import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { tasksApi } from '../../api/tasks.api';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { RoleGate } from '../../components/layout/RoleGate';
import { PriorityBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useToast } from '../../components/ui/Toast';
import { formatDate, isDueDateOverdue } from '../../utils/date';
import { extractApiError } from '../../utils/format';
import type { Task, TaskStatus } from '../../types';

const COLUMNS: { status: TaskStatus; label: string; dotColor: string; countBg: string }[] = [
  { status: 'Todo',       label: 'To Do',       dotColor: 'bg-gray-400',    countBg: 'bg-gray-100 text-gray-600'    },
  { status: 'InProgress', label: 'In Progress', dotColor: 'bg-blue-500',    countBg: 'bg-blue-50 text-blue-700'     },
  { status: 'InReview',   label: 'In Review',   dotColor: 'bg-amber-500',   countBg: 'bg-amber-50 text-amber-700'   },
  { status: 'Done',       label: 'Done',        dotColor: 'bg-emerald-500', countBg: 'bg-emerald-50 text-emerald-700' },
];

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo: ['InProgress'],
  InProgress: ['InReview'],
  InReview: ['Done', 'InProgress'],
  Done: [],
};

const TRANSITION_LABELS: Record<TaskStatus, string> = {
  Todo: 'To Do', InProgress: 'Start', InReview: 'Review', Done: 'Mark Done',
};

export default function BoardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', 'board'],
    queryFn: () => tasksApi.list({ limit: 200 }),
  });

  const allTasks: Task[] = ((data?.data as { data?: Task[] }) ?? {}).data ?? [];

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Status updated', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  return (
    <AppShell>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Team Board</h1>
          <RoleGate roles={['Admin', 'Manager']}>
            <Link
              to="/tasks/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-700 text-white text-sm font-semibold rounded-[6px] hover:bg-violet-800 transition-colors"
            >
              <Plus className="w-4 h-4" /> New Task
            </Link>
          </RoleGate>
        </div>

        {/* Board columns */}
        <div className="flex gap-5 overflow-x-auto pb-4 min-h-[calc(100vh-13rem)]">
          {COLUMNS.map((col) => {
            const colTasks = allTasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className="w-72 shrink-0 flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <span className="font-semibold text-sm text-gray-800">{col.label}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${col.countBg}`}>
                      {colTasks.length}
                    </span>
                  </div>
                  <RoleGate roles={['Admin', 'Manager']}>
                    <Link
                      to="/tasks/new"
                      className="p-0.5 text-gray-400 hover:text-violet-600 transition-colors rounded"
                      aria-label="Add task"
                    >
                      <Plus className="w-4 h-4" />
                    </Link>
                  </RoleGate>
                </div>

                {/* Column separator */}
                <div className={`h-0.5 rounded-full mb-3 ${col.dotColor}`} />

                {/* Task Cards */}
                <div className="flex-1 space-y-3">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="card p-4 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                      </div>
                    ))
                  ) : colTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg py-10 px-4 text-center">
                      <p className="text-sm text-gray-400 mb-3">No tasks here yet</p>
                      <RoleGate roles={['Admin', 'Manager']}>
                        <Link
                          to="/tasks/new"
                          className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
                        >
                          + Add task
                        </Link>
                      </RoleGate>
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const nextStatuses = STATUS_TRANSITIONS[task.status];
                      const canAdvance = user?.role !== 'Member' && nextStatuses.length > 0;
                      const isOverdue = task.due_date ? isDueDateOverdue(task.due_date) : false;

                      return (
                        <div
                          key={task.id}
                          className="card p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 border-l-[3px]"
                          style={{ borderLeftColor: col.dotColor.replace('bg-', '').includes('violet') ? '#7c3aed' : undefined }}
                        >
                          {/* Top row: priority + actions */}
                          <div className="flex items-center justify-between mb-2">
                            <PriorityBadge priority={task.priority} />
                          </div>

                          {/* Title */}
                          <Link
                            to={`/tasks/${task.id}`}
                            className="block text-sm font-semibold text-gray-900 hover:text-violet-700 line-clamp-2 mb-3 transition-colors"
                          >
                            {task.title}
                          </Link>

                          {/* Bottom row: assignee + due date */}
                          <div className="flex items-center justify-between">
                            {task.assignee ? (
                              <div className="flex items-center gap-1.5">
                                <Avatar name={task.assignee.full_name} size="sm" />
                                <span className="text-xs text-gray-500 truncate max-w-[90px]">
                                  {task.assignee.full_name}
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-300">Unassigned</span>
                            )}

                            {task.due_date && (
                              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-gray-400'}`}>
                                {isOverdue ? '⚠ ' : ''}{formatDate(task.due_date)}
                              </span>
                            )}
                          </div>

                          {/* Advance status buttons */}
                          {canAdvance && (
                            <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                              {nextStatuses.map((nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() => statusMutation.mutate({ id: task.id, status: nextStatus })}
                                  disabled={statusMutation.isPending}
                                  className="text-xs px-2 py-1 bg-violet-50 text-violet-700 hover:bg-violet-100 rounded-[4px] transition-colors font-medium"
                                >
                                  → {TRANSITION_LABELS[nextStatus]}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom + Add Task */}
                {!isLoading && colTasks.length > 0 && (
                  <RoleGate roles={['Admin', 'Manager']}>
                    <Link
                      to="/tasks/new"
                      className="mt-3 flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add Task
                    </Link>
                  </RoleGate>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
