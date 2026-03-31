import { z } from 'zod';

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(150).optional(),
  description: z.string().optional(),
});

export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
