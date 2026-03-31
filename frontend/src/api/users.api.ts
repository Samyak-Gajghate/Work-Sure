import apiClient from './client';
import type { User, Workspace, PaginatedResponse, ApiResponse } from '../types';

export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiClient.get<PaginatedResponse<User>>('/users', { params }),

  invite: (data: { email: string; full_name: string; role: 'Manager' | 'Member' }) =>
    apiClient.post<ApiResponse<User>>('/users/invite', data),

  updateRole: (id: string, role: string) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role }),

  remove: (id: string) =>
    apiClient.delete(`/users/${id}`),

  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/users/profile'),

  updateProfile: (data: { full_name?: string; current_password?: string; new_password?: string }) =>
    apiClient.patch<ApiResponse<User>>('/users/profile', data),
};

export const workspaceApi = {
  get: () =>
    apiClient.get<ApiResponse<Workspace>>('/workspace'),

  update: (data: { name?: string; description?: string }) =>
    apiClient.patch<ApiResponse<Workspace>>('/workspace', data),

  getMembers: (params?: { page?: number; limit?: number }) =>
    apiClient.get<PaginatedResponse<User>>('/workspace/members', { params }),
};
