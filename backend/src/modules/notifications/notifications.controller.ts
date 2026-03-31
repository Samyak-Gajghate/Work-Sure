import { Request, Response } from 'express';
import * as notificationsService from './notifications.service';
import { sendSuccess, sendPaginated } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getNotificationsController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await notificationsService.getMyNotifications(req.user!.id, req.query);
  sendPaginated(res, data, pagination);
});

export const markAsReadController = wrap(async (req: Request, res: Response) => {
  await notificationsService.markAsRead(req.params.id, req.user!.id);
  sendSuccess(res, null);
});

export const markAllAsReadController = wrap(async (req: Request, res: Response) => {
  const result = await notificationsService.markAllAsRead(req.user!.id);
  sendSuccess(res, result);
});
