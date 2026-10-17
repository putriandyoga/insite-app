import { useBaseList } from "@/hooks/core/use-base-list";
import type { PaginatedParams } from "@/types/common";
import { queryKeys } from "@/utils/queryKeys";
import type { StaffItem } from "@patient-verification/types/staffTypes";
import { staffService } from "@patient-verification/services/staffService";

export interface StaffFilterParams extends PaginatedParams {
  per_page?: number;
}

export function useStaffList(
  page = 1,
  filters: Omit<StaffFilterParams, "page"> = {},
  perPage = 20,
) {
  const params: StaffFilterParams = {
    page,
    per_page: perPage,
    ...filters,
  };

  return useBaseList<StaffItem, StaffFilterParams>({
    queryKey: queryKeys.staff.list(params),

    fetcher: (fetcherParams) => {
      return staffService.getPaginated(fetcherParams);
    },

    params,
  });
}
