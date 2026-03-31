import { Request, Response } from 'express';
import * as tasksService from './tasks.service';
import { sendSuccess, sendPaginated, sendNoContent } from '../../utils/response';
import { TaskStatus } from '../../types';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const listTasksController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await tasksService.listTasks(req.query, req.user!.id, req.user!.role);
  sendPaginated(res, data, pagination);
});

export const createTaskController = wrap(async (req: Request, res: Response) => {
  const task = await tasksService.createTask(req.body, req.user!.id);
  sendSuccess(res, task, 'Task created', 201);
});

export const getTaskController = wrap(async (req: Request, res: Response) => {
  const task = await tasksService.getTaskById(req.params.id, req.user!.id, req.user!.role);
  sendSuccess(res, task);
});

export const updateTaskController = wrap(async (req: Request, res: Response) => {
  const task = await tasksService.updateTask(req.params.id, req.body, req.user!.id);
  sendSuccess(res, task, 'Task updated');
});

export const updateTaskStatusController = wrap(async (req: Request, res: Response) => {
  const task = await tasksService.updateTaskStatus(
    req.params.id,
    req.body.status as TaskStatus,
    req.user!.id,
    req.user!.role
  );
  sendSuccess(res, task, 'Status updated');
});

export const deleteTaskController = wrap(async (req: Request, res: Response) => {
  await tasksService.deleteTask(req.params.id, req.user!.id);
  sendNoContent(res);
});
