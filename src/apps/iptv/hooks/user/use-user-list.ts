import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { UserItem } from "@iptv/types/userTypes";
import { userService } from "@iptv/services/userService";

export interface UserFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useUserList(
  page = 1,
  filters: Omit<UserFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: UserFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<UserItem, UserFilterParams>({
    queryKey: queryKeys.user.list(params),

    fetcher: (fetcherParams) => {
      return userService.getPaginated(fetcherParams);
    },

    params,
  });
}
