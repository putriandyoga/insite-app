import type { CrudAdapter, PaginationResult } from "@/types/common";

export const iptvAdapter: CrudAdapter = {
  normalizePagination: <T>(response: any): PaginationResult<T> => {
    // Response dari IPTV membungkus items & pagination di dalam properti 'data'
    const resultData = response.data || response;
    const pagination = resultData.pagination || {};

    return {
      items: resultData.items || [],
      total: pagination.total || 0,
      currentPage: pagination.current_page || 1,
      lastPage: pagination.last_page || 1,
      perPage: pagination.per_page || 20,
      from: pagination.from,
      to: pagination.to,
    };
  },

  normalizeList: <T>(response: any): T[] => {
    const resultData = response.data || response;
    return resultData.items || resultData || [];
  },

  normalizeDetail: <T>(response: any): T => {
    const resultData = response.data || response;
    return resultData.item || resultData;
  },
};
