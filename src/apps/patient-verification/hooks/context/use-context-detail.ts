import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { ContextItem } from "@patient-verification/types/contextTypes";
import { contextService } from "@patient-verification/services/contextService";

export function useContextDetail(contextId?: string) {
  return useBaseDetail<ContextItem>({
    id: contextId,

    queryKey: queryKeys.context.detail(contextId || ""),

    fetcher: contextService.getDetail,
  });
}
