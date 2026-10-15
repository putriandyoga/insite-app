export interface PaginationResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  from?: number;
  to?: number;
}

export interface CrudAdapter {
  normalizePagination: <T>(response: any) => PaginationResult<T>;
  normalizeList: <T>(response: any) => T[];
  normalizeDetail: <T>(response: any) => T;
}

export interface PaginatedParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters?: Record<string, any>;
  [key: string]: any;
}
