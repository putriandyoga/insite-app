import { departementService } from "@patient-verification/services/departementService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useDepartementDelete() {
  return useBaseDelete({
    entityName: "Departement",

    mutationFn: departementService.delete,

    invalidateQueryKey: queryKeys.departement.lists(),

    messages: {
      deleteSuccess: "Departement berhasil dihapus",
    },
  });
}
