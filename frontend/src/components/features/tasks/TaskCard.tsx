import { Link } from 'react-router-dom';
import { MoreHorizontal, AlertTriangle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Task } from '../../../types';
import { PriorityBadge, getPriorityBorderColor } from '../../ui/Badge';
import { Avatar } from '../../ui/Avatar';
import { formatDate, isDueDateOverdue } from '../../../utils/date';

interface TaskCardProps {
  task: Task;
  canEdit?: boolean;
  onEdit?: (task: Task) => void;
  canDelete?: boolean;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, canEdit, onEdit, canDelete, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overdue = isDueDateOverdue(task.due_date);
  const borderColor = getPriorityBorderColor(task.priority);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      className={`card border-l-4 ${borderColor} p-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group`}
    >
      {/* Top row: priority + menu */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <PriorityBadge priority={task.priority} />
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="p-0.5 rounded text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Card actions"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-surface-border rounded-md shadow-lg z-50 overflow-hidden animate-scale-in">
              <Link
                to={`/tasks/${task.id}`}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Open task
              </Link>
              {canEdit && onEdit && (
                <button
                  onClick={() => { onEdit(task); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Edit
                </button>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={() => { onDelete(task); setMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Task title */}
      <Link to={`/tasks/${task.id}`}>
        <h3 className={`text-sm font-semibold text-gray-900 hover:text-brand transition-colors line-clamp-2 leading-snug mb-3 ${task.status === 'Done' ? 'line-through text-gray-400' : ''}`}>
          {task.title}
        </h3>
      </Link>

      {/* Bottom: assignee + due date */}
      <div className="flex items-center justify-between gap-2">
        {task.assignee ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <Avatar name={task.assignee.full_name} size="xs" />
            <span className="text-xs text-gray-500 truncate">{task.assignee.full_name}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-300">Unassigned</span>
        )}
        {task.due_date && (
          <div className={`flex items-center gap-1 text-xs shrink-0 ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {overdue && <AlertTriangle className="w-3 h-3" />}
            {formatDate(task.due_date)}
          </div>
        )}
      </div>
    </div>
  );
}
