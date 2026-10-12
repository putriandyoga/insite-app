import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { WardItem } from "@iptv/types/wardTypes";
import { wardService } from "@iptv/services/wardService";

export interface WardFilterParams extends PaginatedParams {
  title?: string;
  status?: string;
  per_page?: number;
}

export function useWardList(
  page = 1,
  filters: Omit<WardFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: WardFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<WardItem, WardFilterParams>({
    queryKey: queryKeys.ward.list(params),

    fetcher: (fetcherParams) => {
      return wardService.getPaginated(fetcherParams);
    },

    params,
  });
}
