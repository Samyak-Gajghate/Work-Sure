export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: object[];

  constructor(message: string, statusCode: number, code: string, details?: object[]) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error factories
export const notFound = (resource = 'Resource') =>
  new AppError(`${resource} not found`, 404, 'NOT_FOUND');

export const forbidden = (message = 'Insufficient permissions') =>
  new AppError(message, 403, 'FORBIDDEN');

export const unauthorized = (message = 'Authentication required') =>
  new AppError(message, 401, 'AUTHENTICATION_REQUIRED');

export const conflict = (message: string) =>
  new AppError(message, 409, 'CONFLICT');

export const validationError = (message: string, details?: object[]) =>
  new AppError(message, 400, 'VALIDATION_ERROR', details);

export const invalidReference = (message: string) =>
  new AppError(message, 422, 'INVALID_REFERENCE');

export const invalidStatusTransition = (from: string, to: string) =>
  new AppError(`Cannot transition from ${from} to ${to}`, 400, 'INVALID_STATUS_TRANSITION');
