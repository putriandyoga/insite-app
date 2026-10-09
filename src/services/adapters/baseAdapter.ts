import type { CrudAdapter, PaginationResult } from "@/types/common";

export const baseAdapter: CrudAdapter = {
  normalizePagination: <T>(response: any): PaginationResult<T> => {
    // Menghandle response yang kadang dibungkus response.data.data atau langsung response.data
    const target = response.data?.data ? response.data.data : response.data;

    return {
      items: target.data || target.items || [],
      total: target.total || 0,
      currentPage: target.current_page || 1,
      lastPage: target.last_page || 1,
      perPage: target.per_page || 10,
      from: target.from,
      to: target.to,
    };
  },
  normalizeList: <T>(response: any): T[] => {
    return response.data?.data || response.data || [];
  },
  normalizeDetail: <T>(response: any): T => {
    return response.data?.data || response.data;
  },
};
