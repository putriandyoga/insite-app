import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { RoomItem } from "@iptv/types/roomTypes";
import { roomService } from "@iptv/services/roomService";

export interface RoomFilterParams extends PaginatedParams {
  title?: string;
  ward_id?: string;
  status?: string;
  per_page?: number;
}

export function useRoomList(
  page = 1,
  filters: Omit<RoomFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: RoomFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<RoomItem, RoomFilterParams>({
    queryKey: queryKeys.room.list(params),

    fetcher: (fetcherParams) => {
      return roomService.getPaginated(fetcherParams);
    },

    params,
  });
}
