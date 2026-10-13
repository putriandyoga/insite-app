import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { StationItem } from "@iptv/types/stationTypes";
import { stationService } from "@iptv/services/stationService";

export interface StationFilterParams extends PaginatedParams {
  title?: string;
  status?: string;
  per_page?: number;
}

export function useStationList(
  page = 1,
  filters: Omit<StationFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: StationFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<StationItem, StationFilterParams>({
    queryKey: queryKeys.station.list(params),

    fetcher: (fetcherParams) => {
      return stationService.getPaginated(fetcherParams);
    },

    params,
  });
}
