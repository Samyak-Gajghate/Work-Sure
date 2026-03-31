import { Request } from 'express';
import { PaginationMeta } from './response';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export interface ParsedPagination {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(query: Request['query']): ParsedPagination {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(String(query.limit ?? String(DEFAULT_LIMIT)), 10) || DEFAULT_LIMIT));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPagination(total: number, page: number, limit: number): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
