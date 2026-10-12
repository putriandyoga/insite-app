import { wardService } from "@iptv/services/wardService";
import type { WardItem } from "@iptv/types/wardTypes";
import { useBaseAll } from "@/hooks/core/use-base-all";
import { queryKeys } from "@/utils/queryKeys";

export function useWardAll() {
  return useBaseAll<WardItem>({
    queryKey: queryKeys.ward.all,

    fetcher: wardService.getAll,
  });
}
