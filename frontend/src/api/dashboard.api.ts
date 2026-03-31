import apiClient from './client';
import type { ApiResponse, PersonalDashboard, TeamDashboard, WorkspaceStats } from '../types';

export const dashboardApi = {
  getPersonal: () =>
    apiClient.get<ApiResponse<PersonalDashboard>>('/dashboard/personal'),

  getTeam: () =>
    apiClient.get<ApiResponse<TeamDashboard>>('/dashboard/team'),

  getStats: () =>
    apiClient.get<ApiResponse<WorkspaceStats>>('/dashboard/stats'),
};
