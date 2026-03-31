import { Target, RefreshCw, MessageSquare, ArrowLeftRight } from 'lucide-react';
import type { Notification, NotificationType } from '../../../types';
import { formatRelative } from '../../../utils/date';

const TYPE_CONFIG: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  task_assigned:       { icon: Target,        color: 'text-violet-500', bg: 'bg-violet-100' },
  task_status_changed: { icon: RefreshCw,     color: 'text-blue-500',   bg: 'bg-blue-100'   },
  comment_added:       { icon: MessageSquare, color: 'text-cyan-500',   bg: 'bg-cyan-100'   },
  task_reassigned:     { icon: ArrowLeftRight,color: 'text-amber-500',  bg: 'bg-amber-100'  },
};

interface NotificationItemProps {
  notification: Notification;
  onClick: (notification: Notification) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.task_assigned;
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      className={`w-full text-left flex items-start gap-4 px-5 py-4 transition-colors hover:bg-gray-50
        ${!notification.is_read ? 'border-l-[3px] border-l-brand bg-violet-50/50' : 'border-l-[3px] border-l-transparent'}`}
    >
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${cfg.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-snug ${!notification.is_read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">{formatRelative(notification.created_at)}</p>
        {notification.reference_id && (
          <p className="text-xs text-brand mt-1">Click to view task →</p>
        )}
      </div>

      {/* Unread dot */}
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1.5" aria-label="Unread" />
      )}
    </button>
  );
}
