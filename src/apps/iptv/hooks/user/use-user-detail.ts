import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { UserItem } from "@iptv/types/userTypes";
import { userService } from "@iptv/services/userService";

export function useUserDetail(userId?: string) {
  return useBaseDetail<UserItem>({
    id: userId,

    queryKey: queryKeys.user.detail(userId || ""),

    fetcher: userService.getDetail,
  });
}
