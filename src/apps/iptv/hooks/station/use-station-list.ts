import { useBaseList } from "@/hooks/core/use-base-list";
import type { StationItem } from "@/apps/iptv/types/stationTypes";
import type { PaginatedParams } from "@/types/common";
import { stationService } from "@iptv/services/stationService";
import { queryKeys } from "@/utils/queryKeys";

export function useStationList(page = 1, title?: string) {
  const params = {
    page,
    title,
  };

  return useBaseList<StationItem, PaginatedParams>({
    queryKey: queryKeys.station.list(params),

    fetcher: stationService.getPaginated,

    params,
  });
}
