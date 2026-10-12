import { roomService } from "@iptv/services/roomService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useRoomDelete() {
  return useBaseDelete({
    entityName: "Ruangan",

    mutationFn: roomService.delete,

    invalidateQueryKey: queryKeys.room.lists(),

    messages: {
      deleteSuccess: "Ruangan berhasil dihapus",
    },
  });
}
