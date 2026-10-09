import type { AxiosRequestConfig, Method } from "axios";
import type { ApiMeta, PaginationLinks } from "./api";

export interface PaginatedParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
  from?: number;
  to?: number;
  links?: PaginationLinks;
  meta?: ApiMeta;
}

export interface CrudAdapter {
  normalizePagination<T>(
    response: unknown,
    params?: PaginatedParams,
  ): PaginationResult<T>;

  normalizeList<T>(response: unknown): T[];

  normalizeDetail<T>(response: unknown): T;
}

export interface ApiRequestClient {
  apiRequest<T = unknown>(
    method: Method,
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
}
