import { Request, Response } from 'express';
import * as activityService from './activity.service';
import { sendPaginated } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getTaskActivityController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await activityService.getTaskActivity(
    req.params.taskId, req.user!.id, req.user!.role, req.query
  );
  sendPaginated(res, data, pagination);
});

export const getWorkspaceActivityController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await activityService.getWorkspaceActivity(req.query);
  sendPaginated(res, data, pagination);
});
