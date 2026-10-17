import { useBaseAll } from "@/hooks/core/use-base-all";
import { queryKeys } from "@/utils/queryKeys";
import type { DepartementItem } from "@patient-verification/types/departementTypes";
import { departementService } from "@patient-verification/services/departementService";

export function useDepartementAll() {
  return useBaseAll<DepartementItem>({
    queryKey: queryKeys.departement.all(),

    fetcher: departementService.getAll,
  });
}
