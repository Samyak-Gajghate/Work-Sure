import { z } from 'zod';

export const inviteUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  full_name: z.string().min(1).max(150),
  role: z.enum(['Manager', 'Member']),
});

export const updateRoleSchema = z.object({
  role: z.enum(['Manager', 'Member']),
});

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(150).optional(),
  current_password: z.string().optional(),
  new_password: z
    .string()
    .min(8)
    .regex(/\d/)
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .optional(),
});

export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
