import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import type { StbItem } from "@iptv/types/stbTyeps";
import { stbService } from "@iptv/services/stbService";

export function useStbDetail(stbId?: string) {
  return useBaseDetail<StbItem>({
    id: stbId,

    queryKey: queryKeys.stb.detail(stbId || ""),

    fetcher: stbService.getDetail,
  });
}
