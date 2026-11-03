import { PaginatedResult, PaginationParams } from './pagination';

export const DEFAULT_PAGINATION: Required<PaginationParams> = {
  page: 1,
  limit: 20,
  search: '',
  sortBy: 'createdAt',
  sortOrder: 'DESC',
};

export const createEmptyPaginatedResult = <T>(): PaginatedResult<T> => ({
  items: [],
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 0,
});

