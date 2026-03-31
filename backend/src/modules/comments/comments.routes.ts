import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { createCommentSchema, updateCommentSchema } from './comments.schema';
import {
  createCommentController,
  updateCommentController,
  deleteCommentController,
} from './comments.controller';

export const commentsRouter = Router();

// Nested under /api/v1/tasks
commentsRouter.post('/:taskId/comments', authMiddleware, validate(createCommentSchema), createCommentController);
commentsRouter.patch('/:taskId/comments/:commentId', authMiddleware, validate(updateCommentSchema), updateCommentController);
commentsRouter.delete('/:taskId/comments/:commentId', authMiddleware, deleteCommentController);
