import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { BedItem } from "@iptv/types/bedTypes";
import { bedService } from "@iptv/services/bedService";

export function useBedList(page = 1, title?: string, perPage = 20) {
  const params = {
    page,
    title,
    per_page: perPage,
  };

  return useBaseList<BedItem, PaginatedParams>({
    queryKey: queryKeys.bed.list(params),

    fetcher: bedService.getPaginated,

    params,
  });
}
