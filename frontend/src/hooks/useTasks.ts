import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi, type TaskFilters } from '../api/tasks.api';
import { extractErrorMessage } from '../utils/errors';
import { toast } from '../utils/toast';
import type { TaskStatus } from '../types';

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.list(filters).then((r) => r.data),
    staleTime: 30_000,
  });
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => tasksApi.getById(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 30_000,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task created successfully');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateTask(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof tasksApi.update>[1]) =>
      tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateTaskStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: TaskStatus) => tasksApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Status updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Task deleted');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
