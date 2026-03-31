import { Request, Response } from 'express';
import * as workspaceService from './workspace.service';
import { sendSuccess, sendPaginated } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getWorkspaceController = wrap(async (_req: Request, res: Response) => {
  const ws = await workspaceService.getWorkspace();
  sendSuccess(res, ws);
});

export const updateWorkspaceController = wrap(async (req: Request, res: Response) => {
  const ws = await workspaceService.updateWorkspace(req.body);
  sendSuccess(res, ws, 'Workspace updated');
});

export const getWorkspaceMembersController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await workspaceService.getWorkspaceMembers(req.query);
  sendPaginated(res, data, pagination);
});
