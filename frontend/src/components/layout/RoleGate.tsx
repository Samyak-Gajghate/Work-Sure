import React from 'react';
import type { UserRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface RoleGateProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ roles, children, fallback = null }: RoleGateProps) {
  const { user } = useAuth();
  if (!user || !roles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}

export function useRole() {
  const { user } = useAuth();
  return {
    isAdmin:   user?.role === 'Admin',
    isManager: user?.role === 'Manager',
    isMember:  user?.role === 'Member',
    isAtLeast: (role: UserRole) => {
      if (role === 'Member') return true;
      if (role === 'Manager') return user?.role === 'Manager' || user?.role === 'Admin';
      return user?.role === 'Admin';
    },
  };
}
