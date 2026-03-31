import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, LayoutGrid, List, Trash2 } from 'lucide-react';
import { tasksApi } from '../../api/tasks.api';
import type { TaskFilters } from '../../api/tasks.api';
import { workspaceApi } from '../../api/users.api';
import { useAuth } from '../../context/AuthContext';
import { AppShell } from '../../components/layout/AppShell';
import { RoleGate } from '../../components/layout/RoleGate';
import { StatusBadge, PriorityBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { SkeletonTable } from '../../components/ui/Skeleton';
import { Avatar } from '../../components/ui/Avatar';
import { formatDate, isDueDateOverdue } from '../../utils/date';
import type { Task, TaskStatus, User } from '../../types';

export default function TaskListPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<TaskFilters>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => tasksApi.list(filters),
  });

  const { data: membersData } = useQuery({
    queryKey: ['workspace', 'members'],
    queryFn: () => workspaceApi.getMembers({ limit: 100 }),
    enabled: user?.role !== 'Member',
  });

  const tasks: Task[] = ((data?.data as { data?: Task[] }) ?? {}).data ?? [];
  const pagination = (data?.data as { pagination?: unknown })?.pagination;
  const members: User[] = ((membersData?.data as { data?: User[] }) ?? {}).data ?? [];

  const applySearch = () => setFilters((f) => ({ ...f, search, page: 1 }));
  const setFilter = (key: keyof TaskFilters, value: string) =>
    setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));

  // Row selection
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedIds.size === tasks.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(tasks.map((t) => t.id)));
  };
  const clearSelection = () => setSelectedIds(new Set());

  const statuses: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];
  const statusLabels: Record<string, string> = {
    Todo: 'To Do', InProgress: 'In Progress', InReview: 'In Review', Done: 'Done',
  };

  return (
    <AppShell>
      <div className="px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex items-center border border-gray-200 rounded-[6px] overflow-hidden">
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-violet-700 text-white"
                aria-label="List view"
              >
                <List className="w-4 h-4" /> List
              </button>
              <Link
                to="/board"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                aria-label="Board view"
              >
                <LayoutGrid className="w-4 h-4" /> Board
              </Link>
            </div>
            <RoleGate roles={['Admin', 'Manager']}>
              <Link to="/tasks/new">
                <Button><Plus className="w-4 h-4" /> New Task</Button>
              </Link>
            </RoleGate>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-5 flex flex-wrap gap-3">
          <div className="flex gap-2 flex-1 min-w-48">
            <input
              className="input-field flex-1"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            />
            <button onClick={applySearch} className="btn-secondary px-3">
              <Search className="w-4 h-4" />
            </button>
          </div>

          <select
            className="input-field w-40"
            value={filters.status ?? ''}
            onChange={(e) => setFilter('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{statusLabels[s]}</option>
            ))}
          </select>

          <select
            className="input-field w-36"
            value={filters.priority ?? ''}
            onChange={(e) => setFilter('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            {(['Low', 'Medium', 'High', 'Critical'] as const).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {user?.role !== 'Member' && members.length > 0 && (
            <select
              className="input-field w-44"
              value={filters.assignee_id ?? ''}
              onChange={(e) => setFilter('assignee_id', e.target.value)}
            >
              <option value="">All Assignees</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.full_name}</option>
              ))}
            </select>
          )}

          <select
            className="input-field w-40"
            value={filters.sort ?? ''}
            onChange={(e) => setFilter('sort', e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created_at">Created</option>
          </select>
        </div>

        {/* Active filter pills */}
        {(filters.status || filters.priority || filters.assignee_id || filters.search) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.status && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-200">
                Status: {statusLabels[filters.status]}
                <button onClick={() => setFilter('status', '')} className="ml-0.5 hover:text-violet-900">×</button>
              </span>
            )}
            {filters.priority && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-200">
                Priority: {filters.priority}
                <button onClick={() => setFilter('priority', '')} className="ml-0.5 hover:text-violet-900">×</button>
              </span>
            )}
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 text-violet-700 text-xs font-medium rounded-full border border-violet-200">
                Search: {filters.search}
                <button onClick={() => { setSearch(''); setFilter('search', ''); }} className="ml-0.5 hover:text-violet-900">×</button>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="card overflow-hidden">
          {isLoading ? (
            <div className="p-6"><SkeletonTable rows={8} /></div>
          ) : tasks.length === 0 ? (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700 mb-1">No tasks found</p>
              <p className="text-sm text-gray-400">Try adjusting your filters</p>
              <button
                onClick={() => { setFilters({ page: 1, limit: 20 }); setSearch(''); }}
                className="text-sm text-violet-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="w-12 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === tasks.length && tasks.length > 0}
                        onChange={toggleAll}
                        className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                        aria-label="Select all tasks"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Task Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Assignee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tasks.map((task) => {
                    const isSelected = selectedIds.has(task.id);
                    const isOverdue = task.due_date ? isDueDateOverdue(task.due_date) : false;
                    return (
                      <tr
                        key={task.id}
                        className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-violet-50/60' : ''}`}
                      >
                        <td className="w-12 px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(task.id)}
                            className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            aria-label={`Select ${task.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/tasks/${task.id}`}
                            className={`font-medium hover:text-violet-700 transition-colors ${
                              task.status === 'Done'
                                ? 'line-through text-gray-400'
                                : 'text-gray-900'
                            }`}
                          >
                            {task.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={task.status} />
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={task.priority} />
                        </td>
                        <td className="px-4 py-3">
                          {task.assignee ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={task.assignee.full_name} size="sm" />
                              <span className="text-gray-700 truncate max-w-[120px]">
                                {task.assignee.full_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-xs">Unassigned</span>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                          {task.due_date ? formatDate(task.due_date) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {pagination && (
                <div className="px-5 py-4 border-t border-gray-100">
                  <Pagination
                    meta={pagination as Parameters<typeof Pagination>[0]['meta']}
                    onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-xl shadow-xl animate-fade-in">
          <span className="text-sm font-semibold">{selectedIds.size} selected</span>
          <div className="w-px h-4 bg-gray-700" />
          <select
            className="bg-gray-800 text-white text-sm rounded-[4px] px-2 py-1 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-violet-500"
            defaultValue=""
            onChange={() => {
              // Status change — intentionally left as UI prototype (batch API needed)
              clearSelection();
            }}
          >
            <option value="" disabled>Change Status</option>
            <option value="Todo">To Do</option>
            <option value="InProgress">In Progress</option>
            <option value="InReview">In Review</option>
            <option value="Done">Done</option>
          </select>
          <RoleGate roles={['Admin']}>
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-[4px] transition-colors"
              onClick={clearSelection}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </RoleGate>
          <button
            onClick={clearSelection}
            className="ml-1 text-gray-400 hover:text-white transition-colors text-lg leading-none"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      )}
    </AppShell>
  );
}
