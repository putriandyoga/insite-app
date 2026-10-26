import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { ProcessItem } from "@patient-verification/types/processTypes";
import { processService } from "@patient-verification/services/processService";

export function useProcessDetail(processId?: string) {
  return useBaseDetail<ProcessItem>({
    id: processId,

    queryKey: queryKeys.process.detail(processId || ""),

    fetcher: processService.getDetail,
  });
}
