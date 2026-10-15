import type {
  CrudAdapter,
  PaginatedParams,
  PaginationResult,
} from "@/services/types/common";

import { normalizePagination } from "@/services/normalizers/paginationNormalizer";
import {
  normalizeDetail,
  normalizeList,
} from "@/services/normalizers/responseNormalizer";

export const mainAdapter: CrudAdapter = {
  normalizePagination: <T>(
    response: unknown,
    params?: PaginatedParams,
  ): PaginationResult<T> =>
    normalizePagination<T>(response, params?.page ?? 1, params?.per_page ?? 10),

  normalizeList,
  normalizeDetail,
};
