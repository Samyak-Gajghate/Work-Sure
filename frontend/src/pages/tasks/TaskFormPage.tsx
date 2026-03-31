import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { tasksApi } from '../../api/tasks.api';
import { workspaceApi } from '../../api/users.api';
import { AppShell } from '../../components/layout/AppShell';
import { Input, Textarea, Select } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { extractApiError } from '../../utils/format';
import type { User } from '../../types';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Max 200 characters'),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
  status: z.enum(['Todo', 'InProgress', 'InReview', 'Done']).optional(),
});
type TaskFormValues = z.infer<typeof schema>;

export default function TaskFormPage() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: taskData, isLoading: loadingTask } = useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getById(id!),
    enabled: isEdit,
  });

  const task = ((taskData?.data as { data?: unknown; }) ?? {}).data as {
    id: string;
    title: string;
    description?: string | null;
    priority: TaskFormValues['priority'];
    status: NonNullable<TaskFormValues['status']>;
    assignee?: { id: string; full_name: string } | null;
    due_date?: string | null;
  } | undefined;

  const { data: membersData } = useQuery({
    queryKey: ['workspace', 'members'],
    queryFn: () => workspaceApi.getMembers({ limit: 100 }),
  });

  const members: User[] = ((membersData?.data as { data?: User[] }) ?? {}).data ?? [];

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'Medium', status: 'Todo' },
    values: task ? {
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      assignee_id: task.assignee?.id ?? '',
      due_date: task.due_date?.split('T')[0] ?? '',
      status: task.status,
    } : undefined,
  });

  const title = watch('title') ?? '';

  const createMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      tasksApi.create({
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignee_id: data.assignee_id || undefined,
        due_date: data.due_date || undefined,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Task created successfully', 'success');
      const newId = (res.data as { data?: { id?: string } }).data?.id;
      navigate(newId ? `/tasks/${newId}` : '/tasks');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: TaskFormValues) =>
      tasksApi.update(id!, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        assignee_id: data.assignee_id || undefined,
        due_date: data.due_date || undefined,
        status: data.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showToast('Task updated', 'success');
      navigate(`/tasks/${id}`);
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const onSubmit = (data: TaskFormValues) => {
    if (isEdit) updateMutation.mutate(data);
    else createMutation.mutate(data);
  };

  const handleClose = () => navigate(isEdit ? `/tasks/${id}` : '/tasks');

  return (
    <AppShell>
      {/* Slide-in Drawer Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 lg:block hidden"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex flex-col bg-white shadow-2xl w-full max-w-[520px] animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit Task' : 'New Task'}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Task' : 'New Task'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-[6px] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loadingTask ? (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-16 bg-gray-200 rounded mb-1.5" />
                  <div className="h-10 bg-gray-100 rounded-[6px]" />
                </div>
              ))}
            </div>
          ) : (
            <form id="task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Title */}
              <div>
                <Input
                  label="Title *"
                  placeholder="Task title goes here..."
                  error={errors.title?.message}
                  {...register('title')}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{title.length} / 200</p>
              </div>

              {/* Description */}
              <Textarea
                label="Description"
                placeholder="Add more context here..."
                error={errors.description?.message}
                rows={4}
                {...register('description')}
              />

              {/* Grid: Priority + Assignee */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Priority"
                  options={[
                    { value: 'Low', label: '▼ Low' },
                    { value: 'Medium', label: '■ Medium' },
                    { value: 'High', label: '▲ High' },
                    { value: 'Critical', label: '⬛ Critical' },
                  ]}
                  error={errors.priority?.message}
                  {...register('priority')}
                />
                <Select
                  label="Assignee"
                  options={members.map((m) => ({ value: m.id, label: m.full_name }))}
                  placeholder="Unassigned"
                  error={errors.assignee_id?.message}
                  {...register('assignee_id')}
                />
              </div>

              {/* Grid: Due Date + Status (edit only) */}
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Due Date"
                  type="date"
                  error={errors.due_date?.message}
                  {...register('due_date')}
                />
                {isEdit && (
                  <Select
                    label="Status"
                    options={[
                      { value: 'Todo', label: 'To Do' },
                      { value: 'InProgress', label: 'In Progress' },
                      { value: 'InReview', label: 'In Review' },
                      { value: 'Done', label: 'Done' },
                    ]}
                    error={errors.status?.message}
                    {...register('status')}
                  />
                )}
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button form="task-form" type="submit" isLoading={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Task →'}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
