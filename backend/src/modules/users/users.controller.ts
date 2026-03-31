import { Request, Response } from 'express';
import * as usersService from './users.service';
import { sendSuccess, sendPaginated, sendNoContent } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const getAllUsersController = wrap(async (req: Request, res: Response) => {
  const { data, pagination } = await usersService.getAllUsers(req.query);
  sendPaginated(res, data, pagination);
});

export const inviteUserController = wrap(async (req: Request, res: Response) => {
  const user = await usersService.inviteUser(req.body);
  sendSuccess(res, user, 'User invited successfully', 201);
});

export const updateUserRoleController = wrap(async (req: Request, res: Response) => {
  const updated = await usersService.updateUserRole(req.params.id, req.body, req.user!.id);
  sendSuccess(res, updated, 'Role updated');
});

export const removeUserController = wrap(async (req: Request, res: Response) => {
  await usersService.removeUser(req.params.id, req.user!.id);
  sendNoContent(res);
});

export const getProfileController = wrap(async (req: Request, res: Response) => {
  const user = await usersService.getProfile(req.user!.id);
  sendSuccess(res, user);
});

export const updateProfileController = wrap(async (req: Request, res: Response) => {
  const user = await usersService.updateProfile(req.user!.id, req.body);
  sendSuccess(res, user, 'Profile updated');
});
