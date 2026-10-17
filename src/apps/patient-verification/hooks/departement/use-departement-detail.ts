import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { DepartementItem } from "@patient-verification/types/departementTypes";
import { departementService } from "@patient-verification/services/departementService";

export function useDepartementDetail(departementId?: string) {
  return useBaseDetail<DepartementItem>({
    id: departementId,

    queryKey: queryKeys.departement.detail(departementId || ""),

    fetcher: departementService.getDetail,
  });
}
