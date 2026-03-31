import apiClient from './client';
import type { Notification, PaginatedResponse, ApiResponse, PersonalDashboard, TeamDashboard, WorkspaceStats } from '../types';

export const notificationsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<Notification>>('/notifications', { params }),

  markAsRead: (id: string) =>
    apiClient.patch(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch('/notifications/read-all'),
};

export const dashboardApi = {
  getPersonal: () =>
    apiClient.get<ApiResponse<PersonalDashboard>>('/dashboard/personal'),

  getTeam: () =>
    apiClient.get<ApiResponse<TeamDashboard>>('/dashboard/team'),

  getStats: () =>
    apiClient.get<ApiResponse<WorkspaceStats>>('/dashboard/stats'),
};
