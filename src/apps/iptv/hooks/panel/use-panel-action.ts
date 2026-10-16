import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { panelService } from "@iptv/services/panelService";
import { handleApiError } from "@/utils/errorHandler";

export function usePanelCallAction(onSuccess?: () => void) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const acknowledgeCall = async (callId: string) => {
    try {
      setLoadingId(callId);
      await panelService.acknowledgeCall(callId);
      queryClient.invalidateQueries({ queryKey: queryKeys.panel.active() });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Gagal merespons panggilan.");
    } finally {
      setLoadingId(null);
    }
  };

  const resolveCall = async (callId: string) => {
    try {
      setLoadingId(callId);
      await panelService.resolveCall(callId);
      queryClient.invalidateQueries({ queryKey: queryKeys.panel.active() });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Gagal menyelesaikan panggilan.");
    } finally {
      setLoadingId(null);
    }
  };

  return { acknowledgeCall, resolveCall, loadingId };
}
