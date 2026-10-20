import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { ContextItem } from "@patient-verification/types/contextTypes";
import { contextService } from "@patient-verification/services/contextService";

export interface ContextFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useContextList(
  page = 1,
  filters: Omit<ContextFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: ContextFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<ContextItem, ContextFilterParams>({
    queryKey: queryKeys.context.list(params),

    fetcher: (fetcherParams) => {
      return contextService.getPaginated(fetcherParams);
    },

    params,
  });
}
