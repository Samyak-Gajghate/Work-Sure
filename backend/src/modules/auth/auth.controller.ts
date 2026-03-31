import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendSuccess } from '../../utils/response';

export async function registerController(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body);
  sendSuccess(res, result, 'Registration successful', 201);
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body);
  sendSuccess(res, result, 'Login successful');
}

export async function refreshController(req: Request, res: Response): Promise<void> {
  const tokens = await authService.refresh(req.body.refresh_token);
  sendSuccess(res, tokens, 'Tokens refreshed');
}

export async function logoutController(req: Request, res: Response): Promise<void> {
  await authService.logout(req.body.refresh_token);
  sendSuccess(res, null, 'Logged out successfully');
}

export async function getMeController(req: Request, res: Response): Promise<void> {
  const user = await authService.getMe(req.user!.id);
  sendSuccess(res, user);
}
