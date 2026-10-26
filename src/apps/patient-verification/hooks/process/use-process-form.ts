import { processService } from "@patient-verification/services/processService";
import {
  defaultProcess,
  validateProcess,
  type ProcessItem,
} from "@patient-verification/types/processTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useProcessForm(processId?: string) {
  return useBaseForm<ProcessItem>({
    id: processId,

    entityName: "Process",

    defaultValues: defaultProcess,

    queryKey: queryKeys.process.detail(processId || ""),

    invalidateQueryKey: queryKeys.process.lists(),

    getDetail: processService.getDetail,

    createFn: processService.create,

    updateFn: processService.update,

    validate: validateProcess,

    redirectTo: "/app/patient-verification/process",

    messages: {
      createSuccess: "Process berhasil dibuat",

      updateSuccess: "Process berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data process",
    },
  });
}
