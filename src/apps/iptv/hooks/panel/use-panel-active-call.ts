// src/hooks/panel/use-panel-active.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { panelService } from "@iptv/services/panelService";

export function usePanelActiveCalls() {
  return useQuery({
    queryKey: queryKeys.panel.active(),
    queryFn: () => panelService.getActiveCalls(),
  });
}
