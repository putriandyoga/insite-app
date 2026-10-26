import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { CallItem } from "@iptv/types/callTypes";
import { callService } from "@iptv/services/callService";

export interface CallFilterParams extends PaginatedParams {
  title?: string;
  ward_id?: string;
  status?: string;
  per_page?: number;
}

export function useCallList(
  page = 1,
  filters: Omit<CallFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: CallFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<CallItem, CallFilterParams>({
    queryKey: queryKeys.call.list(params),

    fetcher: (fetcherParams) => {
      return callService.getPaginated(fetcherParams);
    },

    params,
  });
}
