import { useBaseAll } from "@/hooks/core/use-base-all";
import { queryKeys } from "@/utils/queryKeys";
import type { ProcessItem } from "@patient-verification/types/processTypes";
import { processService } from "@patient-verification/services/processService";

export function useProcessAll() {
  return useBaseAll<ProcessItem>({
    queryKey: queryKeys.process.all(),

    fetcher: processService.getAll,
  });
}
