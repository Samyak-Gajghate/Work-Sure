import apiClient from './client';
import type { ApiResponse, User } from '../types';

interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
}

export const authApi = {
  login: (body: { email: string; password: string }) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/login', body),

  register: (body: { full_name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<LoginResponse>>('/auth/register', body),

  refresh: (refresh_token: string) =>
    apiClient.post<ApiResponse<RefreshResponse>>('/auth/refresh', { refresh_token }),

  logout: (refresh_token: string) =>
    apiClient.post('/auth/logout', { refresh_token }),

  getMe: () =>
    apiClient.get<ApiResponse<User>>('/auth/me'),
};
