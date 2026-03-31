import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ArrowLeft, Pencil, Trash2, MessageSquare, ChevronDown } from 'lucide-react';
import { tasksApi } from '../../api/tasks.api';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { ConfirmModal } from '../../components/ui/Modal';
import { SkeletonCard } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { formatDate, formatRelative, isDueDateOverdue } from '../../utils/date';
import { extractApiError } from '../../utils/format';
import type { TaskStatus } from '../../types';

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo: ['InProgress'], InProgress: ['InReview'], InReview: ['Done', 'InProgress'], Done: [],
};
const STATUS_LABELS: Record<TaskStatus, string> = { Todo: 'To Do', InProgress: 'In Progress', InReview: 'In Review', Done: 'Done' };

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [comment, setComment] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getById(id!),
    enabled: !!id,
  });

  const task = (data?.data as any)?.data;

  const statusMutation = useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.updateStatus(id!, status),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['task', id] }); showToast('Status updated', 'success'); },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksApi.delete(id!),
    onSuccess: () => { navigate('/tasks'); showToast('Task deleted', 'success'); },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const commentMutation = useMutation({
    mutationFn: () => tasksApi.addComment(id!, comment),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['task', id] }); setComment(''); showToast('Comment added', 'success'); },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => tasksApi.deleteComment(id!, commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['task', id] }),
  });

  if (isLoading) return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8"><SkeletonCard /></div>
    </AppShell>
  );

  if (!task) return <AppShell><div className="p-8 text-center text-gray-500">Task not found</div></AppShell>;

  const availableTransitions = STATUS_TRANSITIONS[task.status as TaskStatus] ?? [];
  const canEdit = user?.role !== 'Member';
  const canDelete = user?.role === 'Admin';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back + Actions */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-2">
              {canEdit && (
                <Link to={`/tasks/${id}/edit`}>
                  <Button variant="secondary" size="sm"><Pencil className="w-4 h-4" /> Edit</Button>
                </Link>
              )}
              {canDelete && (
                <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="w-4 h-4" /> Delete
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h1 className="text-xl font-bold text-gray-900 mb-3">{task.title}</h1>
                {task.description && <p className="text-gray-600 whitespace-pre-wrap text-sm leading-relaxed">{task.description}</p>}
              </div>

              {/* Comments */}
              <div className="card">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <h2 className="font-semibold text-gray-900">Comments ({task.comments?.length ?? 0})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {task.comments?.map((c: any) => (
                    <div key={c.id} className="px-6 py-4 flex gap-3">
                      <Avatar name={c.author.full_name} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-sm font-medium text-gray-900">{c.author.full_name}</span>
                          <span className="text-xs text-gray-400">{formatRelative(c.created_at)}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{c.content}</p>
                      </div>
                      {c.author.id === user?.id && (
                        <button onClick={() => deleteCommentMutation.mutate(c.id)} className="text-gray-300 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-gray-100">
                  <textarea
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <Button size="sm" onClick={() => commentMutation.mutate()} isLoading={commentMutation.isPending} disabled={!comment.trim()}>
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="card p-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={task.status} />
                    {availableTransitions.length > 0 && (
                      <div className="relative group">
                        <button className="flex items-center gap-1 text-xs text-primary-600 hover:underline">
                          Change <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden group-hover:block w-32">
                          {availableTransitions.map((s) => (
                            <button key={s} onClick={() => statusMutation.mutate(s)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors">
                              {STATUS_LABELS[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                  <PriorityBadge priority={task.priority} />
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Assignee</p>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={task.assignee.full_name} size="sm" />
                      <span className="text-sm text-gray-800">{task.assignee.full_name}</span>
                    </div>
                  ) : <span className="text-sm text-gray-400">Unassigned</span>}
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
                  {task.due_date ? (
                    <span className={`text-sm ${isDueDateOverdue(task.due_date) ? 'text-red-600 font-medium' : 'text-gray-800'}`}>
                      {formatDate(task.due_date)}
                    </span>
                  ) : <span className="text-sm text-gray-400">Not set</span>}
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created By</p>
                  <div className="flex items-center gap-2">
                    <Avatar name={task.created_by.full_name} size="sm" />
                    <span className="text-sm text-gray-800">{task.created_by.full_name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400">Created {formatRelative(task.created_at)}</p>
                  <p className="text-xs text-gray-400">Updated {formatRelative(task.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>

          <ConfirmModal
            isOpen={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onConfirm={() => deleteMutation.mutate()}
            title="Delete Task"
            message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
            confirmLabel="Delete"
            isLoading={deleteMutation.isPending}
          />
        </div>
    </AppShell>
  );
}
