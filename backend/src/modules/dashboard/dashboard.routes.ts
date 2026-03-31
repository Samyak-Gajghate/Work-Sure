import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import {
  getPersonalDashboardController,
  getTeamDashboardController,
  getWorkspaceStatsController,
} from './dashboard.controller';

export const dashboardRouter = Router();

dashboardRouter.get('/personal', authMiddleware, getPersonalDashboardController);
dashboardRouter.get('/team', authMiddleware, requireRole(['Admin', 'Manager']), getTeamDashboardController);
dashboardRouter.get('/stats', authMiddleware, requireRole(['Admin']), getWorkspaceStatsController);
