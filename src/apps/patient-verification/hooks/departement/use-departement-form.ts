import { departementService } from "@patient-verification/services/departementService";
import {
  defaultDepartement,
  validateDepartement,
  type DepartementItem,
} from "@patient-verification/types/departementTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useDepartementForm(departementId?: string) {
  return useBaseForm<DepartementItem>({
    id: departementId,

    entityName: "Departement",

    defaultValues: defaultDepartement,

    queryKey: queryKeys.departement.detail(departementId || ""),

    invalidateQueryKey: queryKeys.departement.lists(),

    getDetail: departementService.getDetail,

    createFn: departementService.create,

    updateFn: departementService.update,

    validate: validateDepartement,

    redirectTo: "/app/patient-verification/departement",

    messages: {
      createSuccess: "Departement berhasil dibuat",

      updateSuccess: "Departement berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data departement",
    },
  });
}
