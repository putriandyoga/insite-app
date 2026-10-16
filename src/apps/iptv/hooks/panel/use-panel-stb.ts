// src/hooks/panel/use-panel-stbs.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { panelService } from "@iptv/services/panelService";

export function usePanelStbs() {
  return useQuery({
    queryKey: queryKeys.panel.stbs(),
    queryFn: () => panelService.getStbs(),
  });
}
