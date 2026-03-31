import { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { TaskPriority } from '../../../types';
import { getPriorityConfig } from '../../ui/Badge';

const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

interface PrioritySelectProps {
  priority: TaskPriority;
  onChange: (priority: TaskPriority) => void;
  canEdit?: boolean;
}

export function PrioritySelect({ priority, onChange, canEdit = false }: PrioritySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = getPriorityConfig(priority);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => canEdit && setOpen((v) => !v)}
        disabled={!canEdit}
        className={`badge ${cfg.bg} ${canEdit ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
      >
        <span className={`text-xs ${cfg.color}`}>{cfg.icon}</span>
        <span className={`${cfg.color} font-medium`}>{cfg.label}</span>
      </button>

      {open && canEdit && (
        <div
          className="absolute left-0 top-full mt-1 w-36 bg-white border border-surface-border rounded-md shadow-lg z-50 overflow-hidden animate-scale-in"
          role="listbox"
        >
          {PRIORITIES.map((p) => {
            const pCfg = getPriorityConfig(p);
            return (
              <button
                key={p}
                type="button"
                role="option"
                aria-selected={p === priority}
                onClick={() => { onChange(p); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 text-sm hover:bg-gray-50 transition-colors
                  ${p === priority ? 'font-medium' : ''}`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`text-xs ${pCfg.color}`}>{pCfg.icon}</span>
                  <span className={pCfg.color}>{pCfg.label}</span>
                </span>
                {p === priority && <Check className="w-3.5 h-3.5 text-brand" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
