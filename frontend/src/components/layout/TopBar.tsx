import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, Settings, LogOut, Search, Menu, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '../../api/notifications.api';

interface TopBarProps {
  onMenuClick: () => void;
  breadcrumbs?: Array<{ label: string; to?: string }>;
}

const ROUTE_LABELS: Record<string, string> = {
  '/dashboard':         'Dashboard',
  '/tasks':             'Tasks',
  '/tasks/new':         'New Task',
  '/board':             'Board',
  '/workspace/members': 'Members',
  '/notifications':     'Notifications',
  '/profile':           'Profile',
  '/settings':          'Settings',
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Breadcrumb from route
  const currentLabel = ROUTE_LABELS[location.pathname] ?? 'Page';

  // Unread notification count
  const { data: notifData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getAll({ limit: 100 }),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  const allNotifs: Array<{ is_read: boolean }> = (notifData?.data as { data?: Array<{ is_read: boolean }> })?.data ?? [];
  const unreadCount = allNotifs.filter((n) => !n.is_read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 z-30 flex items-center bg-white border-b border-surface-border"
      style={{ height: 'var(--topbar-height)' }}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-full"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar width offset on desktop */}
      <div className="hidden lg:block shrink-0" style={{ width: 'var(--sidebar-width)' }} />

      {/* Breadcrumb */}
      <div className="flex-1 flex items-center gap-1.5 px-4 min-w-0">
        <span className="text-xs text-gray-400 hidden sm:block">Work-Sure</span>
        <ChevronRight className="w-3 h-3 text-gray-300 hidden sm:block" />
        <span className="text-sm font-semibold text-gray-800 truncate">{currentLabel}</span>
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-1 pr-4">
        {/* Search trigger */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400
            border border-gray-200 rounded-md hover:border-gray-300 hover:text-gray-600 transition-colors"
          aria-label="Search (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search...</span>
          <kbd className="text-2xs bg-gray-100 border border-gray-200 rounded px-1">⌘K</kbd>
        </button>

        {/* Notification bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-4.5 h-4.5 w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-2xs font-semibold
                rounded-full flex items-center justify-center px-0.5 animate-pulse-dot"
              aria-hidden="true"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Avatar dropdown */}
        <div className="relative ml-1" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User menu"
          >
            {user && <Avatar name={user.full_name} size="sm" />}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-md border border-surface-border shadow-lg z-50 overflow-hidden animate-scale-in">
              {/* User info */}
              <div className="px-4 py-3 border-b border-surface-border">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.full_name}</p>
                <p className="text-xs text-gray-500 truncate mt-0.5">{user?.email}</p>
                <p className="text-2xs text-gray-400 mt-0.5">Role: {user?.role}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4 text-gray-400" />
                  View Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-surface-border py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
