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
    transformBeforeSubmit: (data) =>
      ({
        name: data.name,
        description: data.description,
        is_current: data.is_current,
        context_template_id: Number(data.context_template_id),
        stages: (data.stages || []).map((stage, idx) => ({
          stage_name: stage.stage_name,
          stage_order: idx + 1,
          description: stage.description || "",
          is_required: Boolean(stage.is_required), // Ditambahkan
          departments: (stage.departments || []).map((dept) => ({
            departemen_id: Number(dept.departemen_id),
            is_mandatory: Boolean(dept.is_mandatory), // Ditambahkan
          })),
        })),
      }) as Partial<ProcessItem>,
    redirectTo: "/app/patient-verification/process",
    messages: {
      createSuccess: "Process berhasil dibuat",
      updateSuccess: "Process berhasil diperbarui",
      fetchError: "Tidak dapat mengambil data process",
    },
  });
}
