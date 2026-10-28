import { instancesService } from "@patient-verification/services/instancesService";
import {
  defaultInstances,
  validateInstances,
  type InstancesItem,
} from "@patient-verification/types/instancesTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useInstancesForm(instancesId?: string) {
  return useBaseForm<InstancesItem>({
    id: instancesId,

    entityName: "Instances",

    defaultValues: defaultInstances,

    queryKey: queryKeys.instances.detail(instancesId || ""),

    invalidateQueryKey: queryKeys.instances.lists(),

    getDetail: instancesService.getDetail,

    createFn: instancesService.create,

    updateFn: instancesService.update,

    validate: validateInstances,

    redirectTo: "/app/patient-verification/instances",

    messages: {
      createSuccess: "Instances berhasil dibuat",

      updateSuccess: "Instances berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data instances",
    },
  });
}
