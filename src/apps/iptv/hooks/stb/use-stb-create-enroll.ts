import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbCreateEnrollmentCode(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createEnrollmentCode = async (id: string, ttlHours: number = 24) => {
    const result = await showAlert({
      title: "Terbitkan Kode Enrollment?",
      text: `Terbitkan kode pendaftaran dengan durasi ${ttlHours} jam?`,
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Terbitkan",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.createEnrollmentCode(id, ttlHours);

      await showAlert({
        title: "Berhasil!",
        text: "Kode enrollment berhasil diterbitkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat menerbitkan kode enrollment",
      );
    } finally {
      setLoading(false);
    }
  };

  return { createEnrollmentCode, loading };
}
