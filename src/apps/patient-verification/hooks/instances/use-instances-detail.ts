import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { InstancesItem } from "@patient-verification/types/instancesTypes";
import { instancesService } from "@patient-verification/services/instancesService";

export function useInstancesDetail(instancesId?: string) {
  return useBaseDetail<InstancesItem>({
    id: instancesId,

    queryKey: queryKeys.instances.detail(instancesId || ""),

    fetcher: instancesService.getDetail,
  });
}
