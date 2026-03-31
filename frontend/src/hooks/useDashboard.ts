import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export function usePersonalDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'personal'],
    queryFn: () => dashboardApi.getPersonal().then((r) => r.data.data),
    staleTime: 60_000,
  });
}

export function useTeamDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'team'],
    queryFn: () => dashboardApi.getTeam().then((r) => r.data.data),
    staleTime: 60_000,
  });
}

export function useWorkspaceStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
    staleTime: 60_000,
  });
}
