import { staffService } from "@patient-verification/services/staffService";
import {
  defaultStaff,
  validateStaff,
  type StaffItem,
} from "@patient-verification/types/staffTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useStaffForm(staffId?: string) {
  return useBaseForm<StaffItem>({
    id: staffId,

    entityName: "Staff",

    defaultValues: defaultStaff,

    queryKey: queryKeys.staff.detail(staffId || ""),

    invalidateQueryKey: queryKeys.staff.lists(),

    getDetail: staffService.getDetail,

    createFn: staffService.create,

    updateFn: staffService.update,

    validate: validateStaff,

    redirectTo: "/app/patient-verification/staff",

    messages: {
      createSuccess: "Staff berhasil dibuat",

      updateSuccess: "Staff berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data staff",
    },
  });
}
