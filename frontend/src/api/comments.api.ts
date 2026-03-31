import apiClient from './client';
import type { Comment, ApiResponse } from '../types';

export const commentsApi = {
  create: (taskId: string, content: string) =>
    apiClient.post<ApiResponse<Comment>>(`/tasks/${taskId}/comments`, { content }),

  update: (taskId: string, commentId: string, content: string) =>
    apiClient.patch<ApiResponse<Comment>>(`/tasks/${taskId}/comments/${commentId}`, { content }),

  delete: (taskId: string, commentId: string) =>
    apiClient.delete(`/tasks/${taskId}/comments/${commentId}`),
};
