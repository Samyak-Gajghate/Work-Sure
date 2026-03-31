import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  trigger?: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  options,
  value,
  placeholder = 'Select...',
  onChange,
  trigger,
  align = 'left',
  className = '',
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={ref}>
      {trigger ? (
        <button
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          className="inline-flex items-center gap-1"
        >
          {trigger}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => !disabled && setOpen((v) => !v)}
          disabled={disabled}
          className="input-field inline-flex items-center justify-between gap-2 cursor-pointer text-left"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 flex-1 min-w-0">
            {selected?.icon}
            <span className={`truncate ${!selected ? 'text-gray-400' : ''}`}>
              {selected?.label ?? placeholder}
            </span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
        </button>
      )}

      {open && (
        <div
          className={`absolute top-full mt-1 z-50 bg-white border border-surface-border rounded-md shadow-lg
            min-w-full w-max max-w-xs overflow-hidden animate-scale-in
            ${align === 'right' ? 'right-0' : 'left-0'}`}
          role="listbox"
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              role="option"
              aria-selected={opt.value === value}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left
                hover:bg-gray-50 transition-colors duration-100
                ${opt.value === value ? 'text-brand font-medium' : 'text-gray-700'}`}
            >
              <span className="flex items-center gap-2">
                {opt.icon}
                <span className={opt.color}>{opt.label}</span>
              </span>
              {opt.value === value && <Check className="w-3.5 h-3.5 text-brand shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
