import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { AppError } from './utils/errors';

// Route imports (added as modules are built)
import { authRouter } from './modules/auth/auth.routes';
import { usersRouter } from './modules/users/users.routes';
import { workspaceRouter } from './modules/workspace/workspace.routes';
import { tasksRouter } from './modules/tasks/tasks.routes';
import { commentsRouter } from './modules/comments/comments.routes';
import { notificationsRouter } from './modules/notifications/notifications.routes';
import { activityRouter } from './modules/activity/activity.routes';
import { dashboardRouter } from './modules/dashboard/dashboard.routes';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // HTTP logging (skip in test)
  if (env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
  }

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Global rate limiter
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  });
  app.use('/api', globalLimiter);

  // Auth rate limiter (stricter)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many auth attempts' } },
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Work-Sure API is running' });
  });

  // API Routes
  app.use('/api/v1/auth', authLimiter, authRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/workspace', workspaceRouter);
  app.use('/api/v1/tasks', tasksRouter);
  app.use('/api/v1/tasks', commentsRouter);
  app.use('/api/v1/notifications', notificationsRouter);
  app.use('/api/v1/activity', activityRouter);
  app.use('/api/v1/dashboard', dashboardRouter);

  // 404 handler
  app.use((_req, _res, next) => {
    next(new AppError('Route not found', 404, 'NOT_FOUND'));
  });

  // Global error handler (must be last)
  app.use(errorMiddleware);

  return app;
}
