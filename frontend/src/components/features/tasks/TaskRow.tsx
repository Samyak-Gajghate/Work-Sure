import { Link } from 'react-router-dom';
import { MoreHorizontal, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { Task } from '../../../types';
import { StatusBadge, PriorityBadge } from '../../ui/Badge';
import { Avatar } from '../../ui/Avatar';
import { formatDate, isDueDateOverdue, isDueToday } from '../../../utils/date';

interface TaskRowProps {
  task: Task;
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  onDelete?: (task: Task) => void;
}

export function TaskRow({ task, selected = false, onSelect, canEdit = false, canDelete = false, onDelete }: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dueDateClass = !task.due_date
    ? 'text-gray-400'
    : isDueDateOverdue(task.due_date)
      ? 'text-red-600 font-semibold'
      : isDueToday(task.due_date)
        ? 'text-amber-600 font-medium'
        : 'text-gray-500';

  return (
    <tr
      className={`table-row group ${selected ? 'bg-violet-50' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
    >
      {/* Checkbox */}
      <td className="px-3 py-3 w-10">
        {(hovered || selected) && onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(task.id, e.target.checked)}
            className="w-3.5 h-3.5 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
            aria-label={`Select ${task.title}`}
          />
        )}
      </td>

      {/* Task name */}
      <td className="table-cell pl-0 pr-4 min-w-0">
        <Link
          to={`/tasks/${task.id}`}
          className={`font-medium hover:text-brand transition-colors truncate block max-w-xs
            ${task.status === 'Done' ? 'line-through text-gray-400' : 'text-gray-900'}`}
        >
          {task.title}
        </Link>
      </td>

      {/* Status */}
      <td className="table-cell">
        <StatusBadge status={task.status} />
      </td>

      {/* Priority */}
      <td className="table-cell">
        <PriorityBadge priority={task.priority} />
      </td>

      {/* Assignee */}
      <td className="table-cell">
        {task.assignee ? (
          <div className="flex items-center gap-1.5">
            <Avatar name={task.assignee.full_name} size="xs" />
            <span className="text-xs text-gray-600 truncate max-w-[100px]">{task.assignee.full_name}</span>
          </div>
        ) : (
          <span className="text-xs text-gray-400">Unassigned</span>
        )}
      </td>

      {/* Due date */}
      <td className={`table-cell text-xs ${dueDateClass}`}>
        {task.due_date ? formatDate(task.due_date) : <span className="text-gray-300">—</span>}
      </td>

      {/* Actions */}
      <td className="table-cell w-10">
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen((v) => !v); }}
            className={`p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors
              ${hovered || menuOpen ? 'opacity-100' : 'opacity-0'}`}
            aria-label="Task actions"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-surface-border rounded-md shadow-lg z-50 overflow-hidden animate-scale-in">
              <Link
                to={`/tasks/${task.id}`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open
              </Link>
              {canEdit && (
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </Link>
              )}
              {canDelete && onDelete && (
                <button
                  onClick={() => { onDelete(task); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              )}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
