import { userService } from "@iptv/services/userService";
import {
  defaultUser,
  validateUser,
  type UserItem,
} from "@iptv/types/userTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useUserForm(userId?: string) {
  return useBaseForm<UserItem>({
    id: userId,

    entityName: "User",

    defaultValues: defaultUser,

    queryKey: queryKeys.user.detail(userId || ""),

    invalidateQueryKey: queryKeys.user.lists(),

    getDetail: userService.getDetail,

    createFn: userService.create,

    updateFn: userService.update,

    validate: validateUser,

    redirectTo: "/app/iptv/user",

    messages: {
      createSuccess: "User berhasil dibuat",

      updateSuccess: "User berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data user",
    },
  });
}
