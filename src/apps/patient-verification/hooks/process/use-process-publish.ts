import { useState } from "react";
import { processService } from "@patient-verification/services/processService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useProcessPublish(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const publishProcess = async (id: string | number) => {
    const result = await showAlert({
      title: "Publish Process?",
      text: "Proses ini akan dipublikasikan dan siap digunakan.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Publish",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await processService.publish(id);

      await showAlert({
        title: "Berhasil!",
        text: "Proses berhasil dipublikasikan.",
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
        "Terjadi kesalahan saat mempublikasikan proses",
      );
    } finally {
      setLoading(false);
    }
  };

  return { publishProcess, loading };
}
