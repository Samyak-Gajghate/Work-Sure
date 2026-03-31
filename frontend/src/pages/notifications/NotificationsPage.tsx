import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Target, RefreshCw, MessageSquare, ArrowLeftRight } from 'lucide-react';
import { notificationsApi } from '../../api/notifications.api';
import { AppShell } from '../../components/layout/AppShell';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/Toast';
import { formatRelative } from '../../utils/date';
import type { Notification, NotificationType } from '../../types';

type FilterTab = 'all' | 'unread' | 'read';

const TYPE_ICON: Record<NotificationType, React.ElementType> = {
  task_assigned: Target,
  task_status_changed: RefreshCw,
  comment_added: MessageSquare,
  task_reassigned: ArrowLeftRight,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  task_assigned: 'text-violet-600',
  task_status_changed: 'text-blue-600',
  comment_added: 'text-cyan-600',
  task_reassigned: 'text-amber-600',
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getAll({ page, limit: 30 }),
  });

  const allNotifications: Notification[] =
    ((data?.data as { data?: Notification[] }) ?? {}).data ?? [];
  const pagination = (data?.data as { pagination?: unknown })?.pagination;

  // Client-side filter
  const notifications = allNotifications.filter((n) => {
    if (activeTab === 'unread') return !n.is_read;
    if (activeTab === 'read') return n.is_read;
    return true;
  });

  const unreadCount = allNotifications.filter((n) => !n.is_read).length;

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast('All marked as read', 'success');
    },
  });

  const handleClick = (n: Notification) => {
    if (!n.is_read) markReadMutation.mutate(n.id);
    if (n.reference_id) navigate(`/tasks/${n.reference_id}`);
  };

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read' },
  ];

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllMutation.mutate()}
            isLoading={markAllMutation.isPending}
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? 'border-violet-600 text-violet-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6"><SkeletonTable rows={5} /></div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">You're all caught up!</p>
              <p className="text-sm text-gray-400 mt-1">
                {activeTab === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {notifications.map((n) => {
                  const Icon = TYPE_ICON[n.type] ?? Bell;
                  const iconColor = TYPE_COLOR[n.type] ?? 'text-gray-500';
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className={`w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors ${
                        !n.is_read ? 'border-l-[3px] border-l-violet-500 bg-violet-50/30' : ''
                      }`}
                    >
                      {/* Icon */}
                      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {n.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatRelative(n.created_at)}</p>
                        {n.reference_id && (
                          <p className="text-xs text-violet-600 mt-1">Click to view task →</p>
                        )}
                      </div>

                      {/* Unread dot */}
                      {!n.is_read && (
                        <div className="w-2 h-2 bg-violet-500 rounded-full mt-2 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              {pagination && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <Pagination meta={pagination as Parameters<typeof Pagination>[0]['meta']} onPageChange={setPage} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
