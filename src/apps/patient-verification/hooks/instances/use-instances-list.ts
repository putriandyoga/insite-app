import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { InstancesItem } from "@patient-verification/types/instancesTypes";
import { instancesService } from "@patient-verification/services/instancesService";

export interface InstancesFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useInstancesList(
  page = 1,
  filters: Omit<InstancesFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: InstancesFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<InstancesItem, InstancesFilterParams>({
    queryKey: queryKeys.instances.list(params),

    fetcher: (fetcherParams) => {
      return instancesService.getPaginated(fetcherParams);
    },

    params,
  });
}
