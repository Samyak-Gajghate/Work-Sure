import type { ActivityLog } from '../../../types';
import { Avatar } from '../../ui/Avatar';
import { formatRelative } from '../../../utils/date';

interface ActivityFeedProps {
  activities: ActivityLog[];
  compact?: boolean;
}

function getActivityDescription(activity: ActivityLog): string {
  const actor = activity.actor.full_name;
  const action = activity.action;

  if (action.includes('created')) return `${actor} created this task`;
  if (action.includes('status') && activity.old_value && activity.new_value) {
    return `${actor} changed status from ${activity.old_value} to ${activity.new_value}`;
  }
  if (action.includes('assign') && activity.new_value) {
    return `${actor} assigned task to ${activity.new_value}`;
  }
  if (action.includes('comment')) return `${actor} added a comment`;
  if (action.includes('priority') && activity.old_value && activity.new_value) {
    return `${actor} changed priority from ${activity.old_value} to ${activity.new_value}`;
  }
  if (action.includes('due_date') && activity.new_value) {
    return `${actor} set due date to ${activity.new_value}`;
  }

  return `${actor} ${action}`;
}

export function ActivityFeed({ activities, compact = false }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={`${compact ? 'py-6' : 'py-10'} text-center text-sm text-gray-400`}>
        No activity yet
      </div>
    );
  }

  return (
    <div className={`${compact ? 'px-0' : 'px-6 py-4'} space-y-0`}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative flex gap-3 pb-4 last:pb-0">
          {/* Vertical line */}
          {index < activities.length - 1 && (
            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-gray-200" />
          )}

          {/* Avatar / dot */}
          {compact ? (
            <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white shrink-0 mt-0.5" />
          ) : (
            <Avatar name={activity.actor.full_name} size="xs" className="mt-0.5 shrink-0 z-10" />
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 leading-snug">
              {getActivityDescription(activity)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{formatRelative(activity.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
