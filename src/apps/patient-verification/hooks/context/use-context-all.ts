import { useBaseAll } from "@/hooks/core/use-base-all";
import { queryKeys } from "@/utils/queryKeys";
import type { ContextItem } from "@patient-verification/types/contextTypes";
import { contextService } from "@patient-verification/services/contextService";

export function useContextAll() {
  return useBaseAll<ContextItem>({
    queryKey: queryKeys.context.all(),

    fetcher: contextService.getAll,
  });
}
