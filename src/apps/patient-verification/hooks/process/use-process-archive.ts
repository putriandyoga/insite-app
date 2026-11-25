import { useState } from "react";
import { processService } from "@patient-verification/services/processService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useProcessArchive(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const archiveProcess = async (id: string | number) => {
    const result = await showAlert({
      title: "Archive Process?",
      text: "Proses ini akan diarsipkan.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Arsipkan",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await processService.archive(id);

      await showAlert({
        title: "Berhasil!",
        text: "Proses berhasil diarsipkan.",
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
      await handleApiError(err, "Terjadi kesalahan saat mengarsipkan proses");
    } finally {
      setLoading(false);
    }
  };

  return { archiveProcess, loading };
}
