import { useBaseAll } from "@/hooks/core/use-base-all";
import { queryKeys } from "@/utils/queryKeys";
import type { InstancesItem } from "@patient-verification/types/instancesTypes";
import { instancesService } from "@patient-verification/services/instancesService";

export function useInstancesAll() {
  return useBaseAll<InstancesItem>({
    queryKey: queryKeys.instances.all(),

    fetcher: instancesService.getAll,
  });
}
