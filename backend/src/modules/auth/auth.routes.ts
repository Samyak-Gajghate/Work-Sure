import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { registerSchema, loginSchema, refreshSchema, logoutSchema } from './auth.schema';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getMeController,
} from './auth.controller';

export const authRouter = Router();

const asyncWrap =
  (fn: Function) =>
  (req: any, res: any, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next);

authRouter.post('/register', validate(registerSchema), asyncWrap(registerController));
authRouter.post('/login', validate(loginSchema), asyncWrap(loginController));
authRouter.post('/refresh', validate(refreshSchema), asyncWrap(refreshController));
authRouter.post('/logout', authMiddleware, validate(logoutSchema), asyncWrap(logoutController));
authRouter.get('/me', authMiddleware, asyncWrap(getMeController));
