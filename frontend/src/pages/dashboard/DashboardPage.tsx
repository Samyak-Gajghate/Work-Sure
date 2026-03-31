import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Clock, AlertCircle, CalendarClock,
  Users, Plus, TrendingUp, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dashboardApi } from '../../api/dashboard.api';
import { tasksApi } from '../../api/tasks.api';
import { AppShell } from '../../components/layout/AppShell';
import { RoleGate } from '../../components/layout/RoleGate';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';
import { SkeletonStatCards, SkeletonTable } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, isDueDateOverdue, isDueToday } from '../../utils/date';
import type { PersonalDashboard, Task } from '../../types';

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  trend?: string;
  trendColor?: string;
}

function StatCard({ label, value, icon: Icon, iconBg, iconColor, borderColor, trend, trendColor }: StatCardProps) {
  return (
    <div className={`card p-5 border-t-4 ${borderColor}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4.5 h-4.5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{label}</p>
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <p className={`text-xs ${trendColor ?? 'text-gray-400'} flex items-center gap-1`}>
          <TrendingUp className="w-3 h-3" /> {trend}
        </p>
      )}
    </div>
  );
}

// ─── Task Row (compact) ───────────────────────────────────────────────────────
function DashboardTaskRow({ task }: { task: Task }) {
  const navigate = useNavigate();
  const dueDateClass = !task.due_date ? 'text-gray-400'
    : isDueDateOverdue(task.due_date) ? 'text-red-500 font-medium'
    : isDueToday(task.due_date) ? 'text-amber-500 font-medium'
    : 'text-gray-500';

  return (
    <button
      onClick={() => navigate(`/tasks/${task.id}`)}
      className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left group"
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate group-hover:text-brand transition-colors
          ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        {task.assignee && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <Avatar name={task.assignee.full_name} size="xs" />
            <span className="text-xs text-gray-400">{task.assignee.full_name}</span>
          </div>
        )}
      </div>
      <StatusBadge status={task.status} />
      {task.due_date && (
        <span className={`text-xs shrink-0 ${dueDateClass}`}>{formatDate(task.due_date)}</span>
      )}
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.full_name.split(' ')[0] ?? 'there';

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const { data: personalData, isLoading: loadingStats } = useQuery({
    queryKey: ['dashboard', 'personal'],
    queryFn: () => dashboardApi.getPersonal().then((r) => r.data.data),
    staleTime: 60_000,
  });

  const { data: tasksData, isLoading: loadingTasks } = useQuery({
    queryKey: ['tasks', 'my-dashboard'],
    queryFn: () => tasksApi.list({ limit: 10, sort: 'due_date', order: 'asc' }).then((r) => r.data),
    staleTime: 30_000,
  });

  const { data: teamData, isLoading: loadingTeam } = useQuery({
    queryKey: ['dashboard', 'team'],
    queryFn: () => dashboardApi.getTeam().then((r) => r.data.data),
    enabled: user?.role !== 'Member',
    staleTime: 60_000,
  });

  const stats = personalData as PersonalDashboard | undefined;
  const tasks: Task[] = tasksData?.data ?? [];
  const teamTasks = teamData;

  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}, {firstName} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{today}</p>
          </div>
          <RoleGate roles={['Admin', 'Manager']}>
            <Link to="/tasks/new">
              <Button>
                <Plus className="w-4 h-4" />
                New Task
              </Button>
            </Link>
          </RoleGate>
        </div>

        {/* Stat Cards */}
        {loadingStats ? (
          <SkeletonStatCards />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatCard
              label="Open Tasks"
              value={stats?.open_tasks ?? 0}
              icon={Clock}
              iconBg="bg-blue-100" iconColor="text-blue-600"
              borderColor="border-t-blue-500"
              trend="Tasks in progress"
              trendColor="text-blue-400"
            />
            <StatCard
              label="Due Today"
              value={stats?.due_today ?? 0}
              icon={CalendarClock}
              iconBg="bg-amber-100" iconColor="text-amber-600"
              borderColor="border-t-amber-400"
              trend="Need attention today"
              trendColor="text-amber-400"
            />
            <StatCard
              label="Overdue"
              value={stats?.overdue ?? 0}
              icon={AlertCircle}
              iconBg={stats?.overdue ? 'bg-red-100' : 'bg-gray-100'}
              iconColor={stats?.overdue ? 'text-red-600' : 'text-gray-400'}
              borderColor={stats?.overdue ? 'border-t-red-500' : 'border-t-gray-200'}
              trend={stats?.overdue ? 'Requires immediate action' : 'All on track!'}
              trendColor={stats?.overdue ? 'text-red-400' : 'text-emerald-400'}
            />
            <StatCard
              label="Completed"
              value={stats?.done ?? 0}
              icon={CheckCircle2}
              iconBg="bg-emerald-100" iconColor="text-emerald-600"
              borderColor="border-t-emerald-500"
              trend="Keep up the momentum"
              trendColor="text-emerald-400"
            />
            {/* Team tasks — Admin/Manager only */}
            <RoleGate roles={['Admin', 'Manager']}>
              <StatCard
                label="Team Tasks"
                value={teamTasks?.total_tasks ?? 0}
                icon={Users}
                iconBg="bg-violet-100" iconColor="text-violet-600"
                borderColor="border-t-violet-500"
                trend="Across the workspace"
                trendColor="text-violet-400"
              />
            </RoleGate>
          </div>
        )}

        {/* 2-column content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tasks — left 65% */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
                <div className="flex items-center gap-2.5">
                  <h2 className="font-semibold text-gray-900">My Tasks</h2>
                  {tasks.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
                      {tasks.length}
                    </span>
                  )}
                </div>
                <Link
                  to="/tasks"
                  className="text-xs text-brand hover:text-brand-hover font-medium flex items-center gap-1 transition-colors"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {loadingTasks ? (
                <div className="p-5"><SkeletonTable rows={6} /></div>
              ) : tasks.length === 0 ? (
                <EmptyState
                  icon={<CheckCircle2 className="w-10 h-10" />}
                  title="No tasks assigned to you"
                  description="Ask your manager to assign you tasks."
                />
              ) : (
                <div className="divide-y divide-surface-border">
                  {tasks.map((task) => (
                    <DashboardTaskRow key={task.id} task={task} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — 35% */}
          <div className="space-y-5">
            {/* Recent Activity — feeds from team tasks activity */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="px-5">
                {loadingTeam ? (
                  <div className="py-5 space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex gap-3 py-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-1.5" />
                          <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : teamTasks?.by_status ? (
                  // Show a status breakdown as "activity" when team data is available
                  <div className="divide-y divide-surface-border">
                    {Object.entries(teamTasks.by_status)
                      .filter(([, count]) => (count as number) > 0)
                      .slice(0, 4)
                      .map(([status, count]) => {
                        const statusLabels: Record<string, string> = {
                          Todo: 'tasks waiting to start',
                          InProgress: 'tasks in progress',
                          InReview: 'tasks awaiting review',
                          Done: 'tasks completed',
                        };
                        const dotColors: Record<string, string> = {
                          Todo: 'bg-gray-400',
                          InProgress: 'bg-blue-500',
                          InReview: 'bg-amber-500',
                          Done: 'bg-emerald-500',
                        };
                        return (
                          <div key={status} className="flex items-center gap-3 py-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${dotColors[status] ?? 'bg-gray-400'}`} />
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">{count as number}</span>{' '}
                              {statusLabels[status] ?? status}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-400">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats — Admin/Manager */}
            <RoleGate roles={['Admin', 'Manager']}>
              {!loadingTeam && teamTasks && (
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Workspace Overview</h3>
                  <div className="space-y-2.5">
                    {Object.entries(teamTasks.by_status ?? {}).map(([status, count]) => {
                      const pct = teamTasks.total_tasks > 0 ? Math.round((count / teamTasks.total_tasks) * 100) : 0;
                      const colors: Record<string, string> = {
                        Todo: 'bg-gray-400', InProgress: 'bg-blue-500',
                        InReview: 'bg-amber-500', Done: 'bg-emerald-500',
                      };
                      const labels: Record<string, string> = {
                        Todo: 'To Do', InProgress: 'In Progress',
                        InReview: 'In Review', Done: 'Done',
                      };
                      return (
                        <div key={status}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600">{labels[status] ?? status}</span>
                            <span className="font-semibold text-gray-900">{count as number}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${colors[status] ?? 'bg-gray-400'}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </RoleGate>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
