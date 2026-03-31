import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import {
  getNotificationsController,
  markAsReadController,
  markAllAsReadController,
} from './notifications.controller';

export const notificationsRouter = Router();

notificationsRouter.get('/', authMiddleware, getNotificationsController);
notificationsRouter.patch('/read-all', authMiddleware, markAllAsReadController);
notificationsRouter.patch('/:id/read', authMiddleware, markAsReadController);
