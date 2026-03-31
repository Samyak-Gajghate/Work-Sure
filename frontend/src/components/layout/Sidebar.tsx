import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, ListTodo, Kanban,
  Users, Bell, Settings, ChevronRight, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import type { UserRole } from '../../types';

interface NavItem {
  to: string;
  icon: React.ElementType;
  label: string;
  roles?: UserRole[];
}

const MAIN_ITEMS: NavItem[] = [
  { to: '/dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',              icon: ListTodo,         label: 'My Tasks'   },
  { to: '/tasks?view=all',     icon: CheckSquare,      label: 'All Tasks', roles: ['Admin', 'Manager'] },
  { to: '/board',              icon: Kanban,            label: 'Board',     roles: ['Admin', 'Manager'] },
];

const WORKSPACE_ITEMS: NavItem[] = [
  { to: '/workspace/members',  icon: Users,    label: 'Members'  },
  { to: '/settings',           icon: Settings, label: 'Settings', roles: ['Admin'] },
];

interface SidebarProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ collapsed = false, onClose }: SidebarProps) {
  const { user } = useAuth();

  const canSee = (roles?: UserRole[]) => {
    if (!roles) return true;
    return user ? roles.includes(user.role) : false;
  };

  const itemClass = (isActive: boolean) =>
    `sidebar-item rounded-[4px] ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`;

  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: 'var(--sidebar-bg)', width: collapsed ? '56px' : '240px', transition: 'width 200ms ease' }}
    >
      {/* Logo / Workspace */}
      <div className={`flex items-center gap-2.5 px-4 py-4 border-b ${collapsed ? 'justify-center px-2' : ''}`}
        style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex-shrink-0 w-7 h-7 bg-brand rounded-md flex items-center justify-center">
          <CheckSquare className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm tracking-tight">Work-Sure</span>
        )}
        {!collapsed && (
          <button className="ml-auto text-sidebar-text hover:text-white transition-colors" aria-label="New workspace">
            <Plus className="w-3.5 h-3.5" style={{ color: 'var(--sidebar-text)' }} />
          </button>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin space-y-0.5 px-2">
        {/* Main section */}
        {!collapsed && (
          <p className="sidebar-section-label mt-1 mb-0.5">Main</p>
        )}

        {MAIN_ITEMS.filter((item) => canSee(item.roles)).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to.replace(/\?.*$/, '')}
            onClick={onClose}
            className={({ isActive }) => itemClass(isActive)}
            aria-label={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ opacity: isActive ? 1 : 0.65 }}
                />
                {!collapsed && <span className="flex-1 truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Workspace section */}
        {!collapsed && (
          <p className="sidebar-section-label mt-4 mb-0.5">Workspace</p>
        )}
        {collapsed && <div className="my-2 border-t" style={{ borderColor: 'var(--sidebar-border)' }} />}

        {WORKSPACE_ITEMS.filter((item) => canSee(item.roles)).map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) => itemClass(isActive)}
            aria-label={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ opacity: isActive ? 1 : 0.65 }}
                />
                {!collapsed && <span className="flex-1 truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}

        {/* Views section — future */}
        {!collapsed && (
          <>
            <p className="sidebar-section-label mt-4 mb-0.5">Views</p>
            <button
              className="sidebar-item rounded-[4px] w-full text-left opacity-60 hover:opacity-100"
              disabled
            >
              <Plus className="w-4 h-4 shrink-0" style={{ color: 'var(--sidebar-text)' }} />
              <span className="truncate text-xs">Add View</span>
              <ChevronRight className="w-3 h-3 ml-auto" style={{ color: 'var(--sidebar-text)' }} />
            </button>
          </>
        )}
      </nav>

      {/* Bottom user card */}
      {user && (
        <div
          className={`border-t p-3 flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          <Avatar name={user.full_name} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
              <p className="text-2xs truncate" style={{ color: 'var(--sidebar-text)' }}>{user.role}</p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
