import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Trash2, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../api/users.api';
import { AppShell } from '../../components/layout/AppShell';
import { Avatar } from '../../components/ui/Avatar';
import { RoleBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/Input';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { extractApiError } from '../../utils/format';
import { formatDate } from '../../utils/date';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { User, UserRole } from '../../types';

const inviteSchema = z.object({
  full_name: z.string().min(1, 'Name required'),
  email: z.string().email('Valid email required'),
  role: z.enum(['Manager', 'Member']),
});
type InviteForm = z.infer<typeof inviteSchema>;

export default function MembersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'Admin';

  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<{ id: string; name: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['users', page],
    queryFn: () => usersApi.getAll({ page, limit: 20 }),
  });

  const members: User[] = ((data?.data as { data?: User[] }) ?? {}).data ?? [];
  const pagination = (data?.data as { pagination?: unknown })?.pagination;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InviteForm>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { role: 'Member' },
  });

  const inviteMutation = useMutation({
    mutationFn: (d: InviteForm) => usersApi.invite(d),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setInviteOpen(false);
      reset();
      showToast('User invited successfully', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setRemoveTarget(null);
      showToast('Member removed', 'success');
    },
    onError: (err) => {
      showToast(extractApiError(err), 'error');
      setRemoveTarget(null);
    },
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showToast('Role updated', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  const roleOptions = [
    { value: 'Manager', label: 'Manager' },
    { value: 'Member', label: 'Member' },
  ];

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Workspace Members</h1>
            {members.length > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">{members.length} members</p>
            )}
          </div>
          {isAdmin && (
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="w-4 h-4" /> Invite Member
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6"><SkeletonTable rows={6} /></div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Member
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    {isAdmin && <th className="px-4 py-3 w-12" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors relative">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={m.full_name} size="md" />
                          <div>
                            <p className="font-semibold text-gray-900">{m.full_name}</p>
                            <p className="text-xs text-gray-500">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <RoleBadge role={m.role} />
                      </td>
                      <td className="px-4 py-3.5 text-gray-500">
                        {m.joined_at ? formatDate(m.joined_at) : m.created_at ? formatDate(m.created_at) : '—'}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3.5">
                          {m.id !== user?.id && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === m.id ? null : m.id)}
                                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                                aria-label="Member actions"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {openMenuId === m.id && (
                                <>
                                  {/* Backdrop */}
                                  <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setOpenMenuId(null)}
                                  />
                                  {/* Menu */}
                                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                                    {/* Change Role submenu */}
                                    <div className="group relative">
                                      <button className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <span className="flex items-center gap-2">
                                          Change Role
                                        </span>
                                        <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                                      </button>
                                      <div className="hidden group-hover:block absolute left-full top-0 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                                        {(['Manager', 'Member'] as UserRole[]).map((role) => (
                                          <button
                                            key={role}
                                            disabled={m.role === role}
                                            onClick={() => {
                                              setOpenMenuId(null);
                                              changeRoleMutation.mutate({ id: m.id, role });
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                              m.role === role
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                          >
                                            {role} {m.role === role && '✓'}
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="border-t border-gray-100" />

                                    {/* Remove */}
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setRemoveTarget({ id: m.id, name: m.full_name });
                                      }}
                                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      Remove from workspace
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {pagination && (
                <div className="px-6 py-4 border-t border-gray-100">
                  <Pagination
                    meta={pagination as Parameters<typeof Pagination>[0]['meta']}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={inviteOpen}
        onClose={() => { setInviteOpen(false); reset(); }}
        title="Invite a team member"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setInviteOpen(false); reset(); }}>Cancel</Button>
            <Button form="invite-form" type="submit" isLoading={isSubmitting}>Send Invite</Button>
          </>
        }
      >
        <form id="invite-form" onSubmit={handleSubmit((d) => inviteMutation.mutate(d))} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Priya Sharma"
            error={errors.full_name?.message}
            {...register('full_name')}
          />
          <Input
            label="Email address"
            type="email"
            placeholder="priya@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Select
            label="Role"
            options={roleOptions}
            error={errors.role?.message}
            {...register('role')}
          />
        </form>
      </Modal>

      {/* Remove Confirmation */}
      <ConfirmModal
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => removeTarget && removeMutation.mutate(removeTarget.id)}
        title={`Remove ${removeTarget?.name}?`}
        message="This will revoke their access to the workspace. Their tasks will remain assigned."
        confirmLabel="Remove Member"
        isLoading={removeMutation.isPending}
      />
    </AppShell>
  );
}
