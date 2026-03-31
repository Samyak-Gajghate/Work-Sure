import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--surface-bg)' }}>
      {/* Desktop sidebar — fixed left */}
      <div
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40"
        style={{ width: 'var(--sidebar-width)', top: 'var(--topbar-height)' }}
      >
        <Sidebar />
      </div>

      {/* Mobile sidebar — overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 lg:hidden animate-slide-in-right"
            style={{ animationName: 'slideInLeft' }}
          >
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Top bar — fixed top, full width */}
      <TopBar onMenuClick={() => setSidebarOpen((v) => !v)} />

      {/* Main content — offset for sidebar (desktop) and topbar */}
      <main
        className="flex-1 min-w-0 flex flex-col"
        style={{
          paddingTop: 'var(--topbar-height)',
          paddingLeft: undefined,
          marginLeft: undefined,
        }}
      >
        <div
          className="hidden lg:block shrink-0"
          style={{ marginLeft: 'var(--sidebar-width)' }}
        />
        <div className="lg:ml-[240px] flex-1 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
