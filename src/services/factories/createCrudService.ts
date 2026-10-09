import type { Method } from "axios";
import type { HttpClient } from "../clients/httpClient";
import { buildQuery } from "../utils/buildQuery";
import { normalizePayload } from "../utils/normalizePayload";
import type {
  CrudAdapter,
  PaginatedParams,
  PaginationResult,
} from "@/types/common";

interface CrudOptions {
  api: HttpClient;
  adapter: CrudAdapter;
  useFormData?: boolean;
  allEndpoint?: string;
  updateMethod?: Method;
}

export function createCrudService<T>(basePath: string, options: CrudOptions) {
  const {
    api,
    adapter,
    useFormData,
    allEndpoint,
    updateMethod = "PUT",
  } = options;

  return {
    async getPaginated(params?: PaginatedParams): Promise<PaginationResult<T>> {
      const query = buildQuery(params);
      const url = query ? `${basePath}?${query}` : basePath;

      const response = await api.request<any>("GET", url);
      return adapter.normalizePagination<T>(response);
    },

    async getAll(params?: PaginatedParams): Promise<T[]> {
      const query = buildQuery(params);
      const endpoint = allEndpoint ?? basePath;
      const url = query ? `${endpoint}?${query}` : endpoint;

      const response = await api.request<any>("GET", url);
      return adapter.normalizeList<T>(response);
    },

    async getDetail(id: string | number): Promise<T> {
      const response = await api.request<any>("GET", `${basePath}/${id}`);
      return adapter.normalizeDetail<T>(response);
    },

    async create(payload: any): Promise<T> {
      if (useFormData) {
        const formData = normalizePayload(payload);
        return api.request<T>("POST", basePath, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return api.request<T>("POST", basePath, payload);
    },

    async update(id: string | number, payload: any): Promise<T> {
      if (useFormData) {
        const formData = normalizePayload(payload);
        formData.append("_method", updateMethod);
        return api.request<T>("POST", `${basePath}/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      return api.request<T>(updateMethod, `${basePath}/${id}`, payload);
    },

    async delete(id: string | number): Promise<void> {
      await api.request<void>("DELETE", `${basePath}/${id}`);
    },
  };
}
