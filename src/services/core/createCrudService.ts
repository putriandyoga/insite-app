// C:\Project\Production\insite-react\src\services\core\createCrudService.ts
import type { Method } from "axios";
import type {
  ApiRequestClient,
  CrudAdapter,
  PaginatedParams,
  PaginationResult,
} from "@/services/types/common";

import { normalizePagination } from "@/services/normalizers/paginationNormalizer";
import {
  normalizeDetail,
  normalizeList,
} from "@/services/normalizers/responseNormalizer";
import { buildQuery } from "./buildQuery";
import { normalizePayload } from "../normalizers/normalizePayload";

interface CrudOptions {
  api: ApiRequestClient;
  adapter?: CrudAdapter;
  useFormData?: boolean;
  allEndpoint?: string;
  updateMethod?: Method;
}

const defaultAdapter: CrudAdapter = {
  normalizePagination: <T>(
    response: unknown,
    params?: PaginatedParams,
  ): PaginationResult<T> =>
    normalizePagination<T>(response, params?.page ?? 1, params?.per_page ?? 10),

  normalizeList,
  normalizeDetail,
};
export function createCrudService<T>(basePath: string, options: CrudOptions) {
  const {
    api,
    adapter = defaultAdapter,
    useFormData = false,
    allEndpoint,
    updateMethod = "PUT",
  } = options;

  const allPath = allEndpoint ?? basePath;

  function withQuery(path: string, params?: PaginatedParams): string {
    const query = buildQuery(params);
    return query ? `${path}?${query}` : path;
  }

  function resourcePath(id: string | number): string {
    return `${basePath}/${encodeURIComponent(String(id))}`;
  }

  return {
    async getPaginated(params?: PaginatedParams): Promise<PaginationResult<T>> {
      const response = await api.apiRequest<unknown>(
        "GET",
        withQuery(basePath, params),
      );
      return adapter.normalizePagination<T>(response, params);
    },

    async getAll(params?: PaginatedParams): Promise<T[]> {
      const response = await api.apiRequest<unknown>(
        "GET",
        withQuery(allPath, params),
      );
      return adapter.normalizeList<T>(response);
    },

    async getDetail(id: string | number): Promise<T> {
      const response = await api.apiRequest<unknown>("GET", resourcePath(id));
      return adapter.normalizeDetail<T>(response);
    },

    async create(payload: unknown): Promise<T> {
      const data = useFormData ? normalizePayload(payload) : payload;
      const response = await api.apiRequest<unknown>("POST", basePath, data);
      return adapter.normalizeDetail<T>(response);
    },

    async update(id: string | number, payload: unknown): Promise<T> {
      const path = resourcePath(id);

      if (!useFormData) {
        const response = await api.apiRequest<unknown>(
          updateMethod,
          path,
          payload,
        );
        return adapter.normalizeDetail<T>(response);
      }

      const formData = normalizePayload(payload);
      if (updateMethod !== "POST") {
        formData.append("_method", updateMethod);
      }

      const response = await api.apiRequest<unknown>("POST", path, formData);
      return adapter.normalizeDetail<T>(response);
    },

    async delete(id: string | number): Promise<void> {
      await api.apiRequest<void>("DELETE", resourcePath(id));
    },
  };
}
