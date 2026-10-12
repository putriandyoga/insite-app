import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { WardItem } from "@iptv/types/wardTypes";
import { wardService } from "@iptv/services/wardService";

export function useWardList(page = 1, title?: string, perPage = 20) {
  const params = {
    page,
    title,
    per_page: perPage,
  };

  return useBaseList<WardItem, PaginatedParams>({
    queryKey: queryKeys.ward.list(params),

    fetcher: wardService.getPaginated,

    params,
  });
}
