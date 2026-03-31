import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Medium'),
  assignee_id: z.string().uuid('Invalid assignee ID').optional(),
  due_date: z.string().date('Invalid date format').optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  assignee_id: z.string().uuid().nullable().optional(),
  due_date: z.string().date().nullable().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['Todo', 'InProgress', 'InReview', 'Done']),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
