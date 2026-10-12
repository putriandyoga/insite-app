import { wardService } from "@iptv/services/wardService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useWardDelete() {
  return useBaseDelete({
    entityName: "Ruang Perawatan",

    mutationFn: wardService.delete,

    invalidateQueryKey: queryKeys.ward.lists(),

    messages: {
      deleteSuccess: "Ruang Perawatan berhasil dihapus",
    },
  });
}
