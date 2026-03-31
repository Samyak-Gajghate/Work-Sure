import { Request, Response } from 'express';
import * as commentsService from './comments.service';
import { sendSuccess, sendNoContent } from '../../utils/response';

const wrap = (fn: Function) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const createCommentController = wrap(async (req: Request, res: Response) => {
  const comment = await commentsService.createComment(req.params.taskId, req.body, req.user!.id);
  sendSuccess(res, comment, 'Comment added', 201);
});

export const updateCommentController = wrap(async (req: Request, res: Response) => {
  const comment = await commentsService.updateComment(
    req.params.taskId, req.params.commentId, req.body, req.user!.id
  );
  sendSuccess(res, comment, 'Comment updated');
});

export const deleteCommentController = wrap(async (req: Request, res: Response) => {
  await commentsService.deleteComment(req.params.taskId, req.params.commentId, req.user!.id, req.user!.role);
  sendNoContent(res);
});
