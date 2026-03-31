import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/role.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema, updateStatusSchema } from './tasks.schema';
import {
  listTasksController,
  createTaskController,
  getTaskController,
  updateTaskController,
  updateTaskStatusController,
  deleteTaskController,
} from './tasks.controller';

export const tasksRouter = Router();

tasksRouter.get('/', authMiddleware, listTasksController);
tasksRouter.post('/', authMiddleware, requireRole(['Admin', 'Manager']), validate(createTaskSchema), createTaskController);
tasksRouter.get('/:id', authMiddleware, getTaskController);
tasksRouter.patch('/:id', authMiddleware, requireRole(['Admin', 'Manager']), validate(updateTaskSchema), updateTaskController);
tasksRouter.patch('/:id/status', authMiddleware, validate(updateStatusSchema), updateTaskStatusController);
tasksRouter.delete('/:id', authMiddleware, requireRole(['Admin']), deleteTaskController);
