import { roomService } from "@iptv/services/roomService";
import {
  defaultRoom,
  validateRoom,
  type RoomItem,
} from "@iptv/types/roomTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useRoomForm(roomId?: string) {
  return useBaseForm<RoomItem>({
    id: roomId,

    entityName: "Ruangan",

    defaultValues: defaultRoom,

    queryKey: queryKeys.room.detail(roomId || ""),

    invalidateQueryKey: queryKeys.room.lists(),

    getDetail: roomService.getDetail,

    createFn: roomService.create,

    updateFn: roomService.update,

    validate: validateRoom,

    redirectTo: "/app/iptv/room",

    messages: {
      createSuccess: "Ruangan berhasil dibuat",

      updateSuccess: "Ruangan berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data ruangan",
    },
  });
}
