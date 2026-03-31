import apiClient from './client';
import type { Task, TaskDetail, PaginatedResponse, ApiResponse } from '../types';

export interface TaskFilters {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignee_id?: string;
  search?: string;
  sort?: string;
  order?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: string;
  assignee_id?: string;
  due_date?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: string;
  status?: string;
  assignee_id?: string;
  due_date?: string;
}

export const tasksApi = {
  list: (params?: TaskFilters) =>
    apiClient.get<PaginatedResponse<Task>>('/tasks', { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<TaskDetail>>(`/tasks/${id}`),

  create: (data: CreateTaskInput) =>
    apiClient.post<ApiResponse<Task>>('/tasks', data),

  update: (id: string, data: UpdateTaskInput) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status }),

  delete: (id: string) =>
    apiClient.delete(`/tasks/${id}`),

  addComment: (taskId: string, content: string) =>
    apiClient.post(`/tasks/${taskId}/comments`, { content }),

  updateComment: (taskId: string, commentId: string, content: string) =>
    apiClient.patch(`/tasks/${taskId}/comments/${commentId}`, { content }),

  deleteComment: (taskId: string, commentId: string) =>
    apiClient.delete(`/tasks/${taskId}/comments/${commentId}`),

  getActivity: (taskId: string) =>
    apiClient.get(`/tasks/${taskId}/activity`),
};
