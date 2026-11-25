import { useState } from "react";
import { processService } from "@patient-verification/services/processService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useProcessRevertToDraft(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const revertToDraft = async (id: string | number) => {
    const result = await showAlert({
      title: "Revert to Draft?",
      text: "Proses akan dikembalikan ke status draft.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Kembalikan",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await processService.revertToDraft(id);

      await showAlert({
        title: "Berhasil!",
        text: "Proses berhasil dikembalikan ke draft.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.process.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.process.detail(String(id)),
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat mengembalikan proses ke draft",
      );
    } finally {
      setLoading(false);
    }
  };

  return { revertToDraft, loading };
}
