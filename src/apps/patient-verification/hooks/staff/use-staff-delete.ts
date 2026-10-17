import { staffService } from "@patient-verification/services/staffService";
import { useBaseDelete } from "@/hooks/core/use-base-delete";
import { queryKeys } from "@/utils/queryKeys";

export function useStaffDelete() {
  return useBaseDelete({
    entityName: "Staff",

    mutationFn: staffService.delete,

    invalidateQueryKey: queryKeys.staff.lists(),

    messages: {
      deleteSuccess: "Staff berhasil dihapus",
    },
  });
}
