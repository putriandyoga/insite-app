import { useState } from "react";
import { processService } from "@patient-verification/services/processService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useProcessDuplicate(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createDuplicate = async (id: string | number) => {
    const result = await showAlert({
      title: "Buat Versi Baru?",
      text: "Sistem akan menduplikasi/membuat versi baru dari proses ini.",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Buat Versi Baru",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await processService.createNewVersion(id);

      await showAlert({
        title: "Berhasil!",
        text: "Versi baru proses berhasil dibuat.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.process.lists() });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat membuat versi baru proses",
      );
    } finally {
      setLoading(false);
    }
  };

  return { createDuplicate, loading };
}
