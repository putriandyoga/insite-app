import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { StaffItem } from "@patient-verification/types/staffTypes";
import { staffService } from "@patient-verification/services/staffService";

export function useStaffDetail(staffId?: string) {
  return useBaseDetail<StaffItem>({
    id: staffId,

    queryKey: queryKeys.staff.detail(staffId || ""),

    fetcher: staffService.getDetail,
  });
}
