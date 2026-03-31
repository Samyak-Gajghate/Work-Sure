import { Response } from 'express';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function sendSuccess(res: Response, data: unknown, message?: string, statusCode = 200): void {
  res.status(statusCode).json({ success: true, data, ...(message ? { message } : {}) });
}

export function sendPaginated(res: Response, data: unknown[], pagination: PaginationMeta): void {
  res.status(200).json({ success: true, data, pagination });
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
