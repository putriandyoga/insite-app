// hooks/instance/use-instance-update-context.ts
import { useState } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

interface UpdateContextParams {
  context_data: Record<string, any>;
  change_reason: string;
}

export function useInstanceUpdateContext(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateContext = async (
    id: string | number,
    data: UpdateContextParams,
  ) => {
    try {
      setLoading(true);
      await instancesService.updateContext(id, data);

      await showAlert({
        title: "Berhasil!",
        text: "Context data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.instances?.detail?.(String(id)) ?? [
          "instances",
          String(id),
        ],
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat memperbarui context data",
      );
    } finally {
      setLoading(false);
    }
  };

  return { updateContext, loading };
}
