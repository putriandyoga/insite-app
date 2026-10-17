import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { DepartementItem } from "@patient-verification/types/departementTypes";
import { departementService } from "@patient-verification/services/departementService";

export interface DepartementFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useDepartementList(
  page = 1,
  filters: Omit<DepartementFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: DepartementFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<DepartementItem, DepartementFilterParams>({
    queryKey: queryKeys.departement.list(params),

    fetcher: (fetcherParams) => {
      return departementService.getPaginated(fetcherParams);
    },

    params,
  });
}
