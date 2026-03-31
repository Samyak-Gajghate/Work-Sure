import React from 'react';
import type { TaskStatus, TaskPriority, UserRole } from '../../types';

// ─── Generic ────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
  return <span className={`badge ${className}`}>{children}</span>;
}

// ─── Status ──────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<TaskStatus, { dot: string; text: string; bg: string; label: string }> = {
  Todo:       { dot: 'bg-gray-400',    text: 'text-gray-600',   bg: 'bg-gray-100',    label: 'To Do'       },
  InProgress: { dot: 'bg-blue-500',    text: 'text-blue-700',   bg: 'bg-blue-50',     label: 'In Progress' },
  InReview:   { dot: 'bg-amber-500',   text: 'text-amber-700',  bg: 'bg-amber-50',    label: 'In Review'   },
  Done:       { dot: 'bg-emerald-500', text: 'text-emerald-700',bg: 'bg-emerald-50',  label: 'Done'        },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.Todo;
  return (
    <span className={`badge ${cfg.bg} ${cfg.text}`}>
      <span className={`status-dot ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function getStatusConfig(status: TaskStatus) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.Todo;
}

export function getStatusLabel(status: TaskStatus): string {
  return STATUS_CONFIG[status]?.label ?? status;
}

// ─── Priority ────────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<TaskPriority, { color: string; bg: string; icon: string; label: string }> = {
  Low:      { color: 'text-gray-400',   bg: 'bg-gray-50',   icon: '▼', label: 'Low'      },
  Medium:   { color: 'text-blue-500',   bg: 'bg-blue-50',   icon: '■', label: 'Medium'   },
  High:     { color: 'text-orange-500', bg: 'bg-orange-50', icon: '▲', label: 'High'     },
  Critical: { color: 'text-red-500',    bg: 'bg-red-50',    icon: '⬛', label: 'Critical' },
};

const PRIORITY_LEFT_BORDER: Record<TaskPriority, string> = {
  Low:      'border-l-gray-300',
  Medium:   'border-l-blue-400',
  High:     'border-l-orange-400',
  Critical: 'border-l-red-500',
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const cfg = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Low;
  return (
    <span className={`badge ${cfg.bg}`}>
      <span className={`text-xs ${cfg.color}`}>{cfg.icon}</span>
      <span className={`${cfg.color} font-medium`}>{cfg.label}</span>
    </span>
  );
}

export function getPriorityConfig(priority: TaskPriority) {
  return PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG.Low;
}

export function getPriorityBorderColor(priority: TaskPriority): string {
  return PRIORITY_LEFT_BORDER[priority] ?? 'border-l-gray-300';
}

// ─── Role ────────────────────────────────────────────────────────────────────
const ROLE_CONFIG: Record<UserRole, { bg: string; text: string }> = {
  Admin:   { bg: 'bg-violet-100', text: 'text-violet-700' },
  Manager: { bg: 'bg-blue-100',   text: 'text-blue-700'   },
  Member:  { bg: 'bg-gray-100',   text: 'text-gray-600'   },
};

export function RoleBadge({ role }: { role: UserRole | string }) {
  const cfg = ROLE_CONFIG[role as UserRole] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <span className={`badge ${cfg.bg} ${cfg.text}`}>{role}</span>
  );
}
