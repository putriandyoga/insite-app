import { processService } from "@patient-verification/services/processService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useProcessDelete() {
  return useBaseDelete({
    entityName: "Process Template",

    mutationFn: processService.delete,

    invalidateQueryKey: queryKeys.process.lists(),

    messages: {
      deleteSuccess: "Process berhasil dihapus",
    },
  });
}
