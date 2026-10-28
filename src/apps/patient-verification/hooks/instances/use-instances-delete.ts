import { instancesService } from "@patient-verification/services/instancesService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useInstancesDelete() {
  return useBaseDelete({
    entityName: "Instances Template",

    mutationFn: instancesService.delete,

    invalidateQueryKey: queryKeys.instances.lists(),

    messages: {
      deleteSuccess: "Instances berhasil dihapus",
    },
  });
}
