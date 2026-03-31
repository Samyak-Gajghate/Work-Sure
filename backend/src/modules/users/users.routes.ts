import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { inviteUserSchema, updateRoleSchema, updateProfileSchema } from './users.schema';
import {
  getAllUsersController,
  inviteUserController,
  updateUserRoleController,
  removeUserController,
  getProfileController,
  updateProfileController,
} from './users.controller';

export const usersRouter = Router();

usersRouter.get('/', authMiddleware, requireRole(['Admin']), getAllUsersController);
usersRouter.post('/invite', authMiddleware, requireRole(['Admin']), validate(inviteUserSchema), inviteUserController);
usersRouter.patch('/:id/role', authMiddleware, requireRole(['Admin']), validate(updateRoleSchema), updateUserRoleController);
usersRouter.delete('/:id', authMiddleware, requireRole(['Admin']), removeUserController);
usersRouter.get('/profile', authMiddleware, getProfileController);
usersRouter.patch('/profile', authMiddleware, validate(updateProfileSchema), updateProfileController);
