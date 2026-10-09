import type {
  CrudAdapter,
  PaginatedParams,
  PaginationResult,
} from "@/services/types/common";
import {
  normalizeList,
  normalizeDetail,
} from "@/services/normalizers/responseNormalizer";
import { normalizePagination } from "@/services/normalizers/paginationNormalizer";

export const iptvAdapter: CrudAdapter = {
  normalizePagination<T>(
    response: unknown,
    params?: PaginatedParams,
  ): PaginationResult<T> {
    return normalizePagination<T>(
      response,
      params?.page ?? 1,
      params?.per_page ?? 10,
    );
  },

  normalizeList,
  normalizeDetail,
};
