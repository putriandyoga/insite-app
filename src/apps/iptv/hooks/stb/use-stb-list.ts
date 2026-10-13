import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import { stbService } from "@iptv/services/stbService";
import type { StbItem } from "@iptv/types/stbTyeps";

export interface StbFilterParams extends PaginatedParams {
  title?: string;
  status?: string;
  per_page?: number;
}

export function useStbList(
  page = 1,
  filters: Omit<StbFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: StbFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<StbItem, StbFilterParams>({
    queryKey: queryKeys.stb.list(params),

    fetcher: (fetcherParams) => {
      return stbService.getPaginated(fetcherParams);
    },

    params,
  });
}
