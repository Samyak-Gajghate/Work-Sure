import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Building2, Users, GitBranch } from 'lucide-react';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../components/ui/Toast';
import { workspaceApi } from '../../api/users.api';
import { extractApiError } from '../../utils/format';
import { useState } from 'react';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [wsName, setWsName] = useState('');
  const [wsDesc, setWsDesc] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['workspace'],
    queryFn: () => workspaceApi.get(),
  });

  const workspace = (data?.data as { data?: { name: string; description: string | null; member_count: number } })?.data;

  // Initialize form values when data loads
  if (workspace && !wsName) {
    setWsName(workspace.name);
    setWsDesc(workspace.description ?? '');
  }

  const updateMutation = useMutation({
    mutationFn: () => workspaceApi.update({ name: wsName, description: wsDesc }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspace'] });
      showToast('Settings saved', 'success');
    },
    onError: (err) => showToast(extractApiError(err), 'error'),
  });

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

        {/* Workspace Info Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Workspace</h2>
          </div>
          <div className="border-t border-gray-100 pt-5 space-y-4">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-gray-100 rounded-[6px]" />
                <div className="h-24 bg-gray-100 rounded-[6px]" />
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Workspace Name
                  </label>
                  <input
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    placeholder="Work-Sure"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Description (optional)
                  </label>
                  <textarea
                    value={wsDesc}
                    onChange={(e) => setWsDesc(e.target.value)}
                    placeholder="What is this workspace for?"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => updateMutation.mutate()} isLoading={updateMutation.isPending}>
                    <Save className="w-4 h-4" /> Save Settings
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Workspace Stats Card */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-gray-500" />
            <h2 className="font-semibold text-gray-900">Workspace Overview</h2>
          </div>
          <div className="border-t border-gray-100 pt-5">
            {isLoading ? (
              <div className="animate-pulse h-16 bg-gray-100 rounded-[6px]" />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-[8px] p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Members</p>
                  <p className="text-2xl font-bold text-gray-900">{workspace?.member_count ?? 0}</p>
                </div>
                <div className="bg-violet-50 rounded-[8px] p-4">
                  <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider mb-1">Plan</p>
                  <p className="text-sm font-bold text-violet-900">Free Tier</p>
                  <p className="text-xs text-violet-500 mt-0.5">Unlimited tasks</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card p-6 border border-red-200">
          <div className="flex items-center gap-2 mb-5">
            <GitBranch className="w-4 h-4 text-red-500" />
            <h2 className="font-semibold text-red-700">Danger Zone</h2>
          </div>
          <div className="border-t border-red-100 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Delete workspace</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Permanently delete this workspace and all data. This cannot be undone.
                </p>
              </div>
              <button
                disabled
                className="px-4 py-2 text-sm font-semibold text-red-600 border border-red-300 rounded-[6px] opacity-50 cursor-not-allowed"
              >
                Delete Workspace
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
