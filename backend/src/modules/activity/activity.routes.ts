import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { getTaskActivityController, getWorkspaceActivityController } from './activity.controller';

export const activityRouter = Router();

// Workspace-wide activity: Admin only
activityRouter.get('/', authMiddleware, requireRole(['Admin']), getWorkspaceActivityController);

// Task-specific activity also accessible via /api/v1/tasks/:taskId/activity
// This is registered in tasks router too
activityRouter.get('/tasks/:taskId', authMiddleware, getTaskActivityController);
