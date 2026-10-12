import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { BedItem } from "@iptv/types/bedTypes";
import { bedService } from "@iptv/services/bedService";

export interface BedFilterParams extends PaginatedParams {
  title?: string;
  ward_id?: string;
  status?: string;
  per_page?: number;
}

export function useBedList(
  page = 1,
  filters: Omit<BedFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: BedFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<BedItem, BedFilterParams>({
    queryKey: queryKeys.bed.list(params),

    fetcher: (fetcherParams) => {
      return bedService.getPaginated(fetcherParams);
    },

    params,
  });
}
