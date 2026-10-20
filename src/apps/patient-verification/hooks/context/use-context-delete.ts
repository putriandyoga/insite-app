import { contextService } from "@patient-verification/services/contextService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useContextDelete() {
  return useBaseDelete({
    entityName: "Context Template",

    mutationFn: contextService.delete,

    invalidateQueryKey: queryKeys.context.lists(),

    messages: {
      deleteSuccess: "Context berhasil dihapus",
    },
  });
}
