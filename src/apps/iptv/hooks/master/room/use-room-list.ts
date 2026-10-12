import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { RoomItem } from "@iptv/types/roomTypes";
import { roomService } from "@iptv/services/roomService";

export function useRoomList(page = 1, title?: string, perPage = 20) {
  const params = {
    page,
    title,
    per_page: perPage,
  };

  return useBaseList<RoomItem, PaginatedParams>({
    queryKey: queryKeys.room.list(params),

    fetcher: roomService.getPaginated,

    params,
  });
}
