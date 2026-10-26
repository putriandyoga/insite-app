import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { ProcessItem } from "@patient-verification/types/processTypes";
import { processService } from "@patient-verification/services/processService";

export interface ProcessFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useProcessList(
  page = 1,
  filters: Omit<ProcessFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: ProcessFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<ProcessItem, ProcessFilterParams>({
    queryKey: queryKeys.process.list(params),

    fetcher: (fetcherParams) => {
      return processService.getPaginated(fetcherParams);
    },

    params,
  });
}
