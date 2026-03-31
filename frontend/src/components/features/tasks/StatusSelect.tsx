import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import type { TaskStatus } from '../../../types';
import { getStatusConfig } from '../../ui/Badge';

const STATUS_ORDER: TaskStatus[] = ['Todo', 'InProgress', 'InReview', 'Done'];

const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  Todo:       ['InProgress'],
  InProgress: ['InReview'],
  InReview:   ['Done', 'InProgress'],
  Done:       [],
};

interface StatusSelectProps {
  status: TaskStatus;
  onChange: (status: TaskStatus) => void;
  canEdit?: boolean;
  isLoading?: boolean;
}

export function StatusSelect({ status, onChange, canEdit = false, isLoading = false }: StatusSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = getStatusConfig(status);
  const availableNext = STATUS_TRANSITIONS[status] ?? [];
  const allStatuses = canEdit ? STATUS_ORDER : availableNext;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const canChange = allStatuses.length > 0 && !isLoading;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => canChange && setOpen((v) => !v)}
        disabled={!canChange || isLoading}
        className={`badge ${cfg.bg} ${cfg.text} ${canChange ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
        aria-haspopup={canChange ? 'listbox' : undefined}
        aria-expanded={open}
      >
        <span className={`status-dot ${cfg.dot}`} />
        {cfg.label}
        {canChange && <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-1 w-40 bg-white border border-surface-border rounded-md shadow-lg z-50 overflow-hidden animate-scale-in"
          role="listbox"
          aria-label="Change status"
        >
          {allStatuses.map((s) => {
            const sCfg = getStatusConfig(s);
            return (
              <button
                key={s}
                type="button"
                role="option"
                aria-selected={s === status}
                onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors
                  ${s === status ? 'text-brand font-medium' : 'text-gray-700'}`}
              >
                <span className="flex items-center gap-2">
                  <span className={`status-dot ${sCfg.dot}`} />
                  {sCfg.label}
                </span>
                {s === status && <Check className="w-3.5 h-3.5 text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
