import { Request, Response } from 'express';
import * as dashboardService from './dashboard.service';
import { sendSuccess } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getPersonalDashboardController = wrap(async (req: Request, res: Response) => {
  const data = await dashboardService.getPersonalDashboard(req.user!.id);
  sendSuccess(res, data);
});

export const getTeamDashboardController = wrap(async (_req: Request, res: Response) => {
  const data = await dashboardService.getTeamDashboard();
  sendSuccess(res, data);
});

export const getWorkspaceStatsController = wrap(async (_req: Request, res: Response) => {
  const data = await dashboardService.getWorkspaceStats();
  sendSuccess(res, data);
});
