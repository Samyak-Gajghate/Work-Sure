import { useState } from 'react';
import { Search, X } from 'lucide-react';
import type { TaskFilters } from '../../../api/tasks.api';
import type { TaskStatus, TaskPriority } from '../../../types';

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'Todo',       label: 'To Do'       },
  { value: 'InProgress', label: 'In Progress' },
  { value: 'InReview',   label: 'In Review'   },
  { value: 'Done',       label: 'Done'        },
];

const PRIORITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '',         label: 'All Priorities' },
  { value: 'Low',      label: 'Low'            },
  { value: 'Medium',   label: 'Medium'         },
  { value: 'High',     label: 'High'           },
  { value: 'Critical', label: 'Critical'       },
];

const SORT_OPTIONS = [
  { value: '',           label: 'Default Sort' },
  { value: 'due_date',   label: 'Due Date'     },
  { value: 'priority',   label: 'Priority'     },
  { value: 'created_at', label: 'Created'      },
  { value: 'title',      label: 'Title'        },
];

interface FilterBarProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  members?: Array<{ id: string; full_name: string }>;
  showAssigneeFilter?: boolean;
}

export function FilterBar({ filters, onFiltersChange, members = [], showAssigneeFilter = false }: FilterBarProps) {
  const [searchInput, setSearchInput] = useState(filters.search ?? '');

  const update = (patch: Partial<TaskFilters>) => {
    onFiltersChange({ ...filters, ...patch, page: 1 });
  };

  const applySearch = () => update({ search: searchInput || undefined });

  const clearAll = () => {
    setSearchInput('');
    onFiltersChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = !!(filters.status || filters.priority || filters.assignee_id || filters.search);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="flex gap-1 flex-1 min-w-48">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              className="input-field pl-8 pr-3"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
            />
          </div>
          <button
            onClick={applySearch}
            className="btn-secondary px-3 h-10"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Status filter */}
        <select
          className="input-field w-36"
          value={filters.status ?? ''}
          onChange={(e) => update({ status: (e.target.value as TaskStatus) || undefined })}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Priority filter */}
        <select
          className="input-field w-36"
          value={filters.priority ?? ''}
          onChange={(e) => update({ priority: (e.target.value as TaskPriority) || undefined })}
        >
          {PRIORITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Assignee filter (Admin/Manager) */}
        {showAssigneeFilter && members.length > 0 && (
          <select
            className="input-field w-40"
            value={filters.assignee_id ?? ''}
            onChange={(e) => update({ assignee_id: e.target.value || undefined })}
          >
            <option value="">All Assignees</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.full_name}</option>
            ))}
          </select>
        )}

        {/* Sort */}
        <select
          className="input-field w-36"
          value={filters.sort ?? ''}
          onChange={(e) => update({ sort: e.target.value || undefined })}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear button */}
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 h-10 text-xs text-gray-500 border border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filters.status && (
            <ActivePill label={`Status: ${STATUS_OPTIONS.find(o => o.value === filters.status)?.label ?? filters.status}`}
              onRemove={() => update({ status: undefined })} />
          )}
          {filters.priority && (
            <ActivePill label={`Priority: ${filters.priority}`}
              onRemove={() => update({ priority: undefined })} />
          )}
          {filters.assignee_id && (
            <ActivePill
              label={`Assignee: ${members.find(m => m.id === filters.assignee_id)?.full_name ?? 'Unknown'}`}
              onRemove={() => update({ assignee_id: undefined })}
            />
          )}
          {filters.search && (
            <ActivePill label={`"${filters.search}"`}
              onRemove={() => { setSearchInput(''); update({ search: undefined }); }} />
          )}
        </div>
      )}
    </div>
  );
}

function ActivePill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-light text-brand text-xs font-medium rounded-md">
      {label}
      <button onClick={onRemove} className="hover:text-brand-hover transition-colors" aria-label="Remove filter">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
