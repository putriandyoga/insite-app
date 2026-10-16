// src/hooks/panel/use-panel-me.ts
import { useBaseDetail } from "@/hooks/core/use-base-detail";
import { queryKeys } from "@/utils/queryKeys";
import { panelService } from "@iptv/services/panelService";
import type { PanelItem } from "@iptv/types/panelTypes";

export function usePanelMe() {
  return useBaseDetail<PanelItem>({
    id: "me",
    queryKey: queryKeys.panel.me(),
    fetcher: () => panelService.getMe() as Promise<PanelItem>,
  });
}
