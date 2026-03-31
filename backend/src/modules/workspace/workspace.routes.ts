import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateWorkspaceSchema } from './workspace.schema';
import {
  getWorkspaceController,
  updateWorkspaceController,
  getWorkspaceMembersController,
} from './workspace.controller';

export const workspaceRouter = Router();

workspaceRouter.get('/', authMiddleware, getWorkspaceController);
workspaceRouter.patch('/', authMiddleware, requireRole(['Admin']), validate(updateWorkspaceSchema), updateWorkspaceController);
workspaceRouter.get('/members', authMiddleware, getWorkspaceMembersController);
