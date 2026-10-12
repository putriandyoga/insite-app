import { userService } from "@iptv/services/userService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useUserDelete() {
  return useBaseDelete({
    entityName: "User",

    mutationFn: userService.delete,

    invalidateQueryKey: queryKeys.user.lists(),

    messages: {
      deleteSuccess: "User berhasil dihapus",
    },
  });
}
