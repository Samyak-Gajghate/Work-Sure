import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi, workspaceApi } from '../api/users.api';
import { extractErrorMessage } from '../utils/errors';
import { toast } from '../utils/toast';

export function useMembers(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['workspace', 'members', params],
    queryFn: () => workspaceApi.getMembers(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useUsers(params?: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params).then((r) => r.data),
    staleTime: 60_000,
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.invite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Invitation sent');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}

export function useRemoveUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Member removed');
    },
    onError: (err) => toast.error(extractErrorMessage(err)),
  });
}
