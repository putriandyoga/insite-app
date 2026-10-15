import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";
import type { EnrollmentCodeResponse } from "@iptv/types/stbTyeps";

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
      const response: EnrollmentCodeResponse =
        await stbService.createEnrollmentCode(id, ttlHours);

      const code = response.code || "-";
      const formattedExpires = response.expires_at
        ? new Date(response.expires_at).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "-";

      setLoading(false);

      await showAlert({
        title: "Berhasil!",
        text: "Kode enrollment berhasil diterbitkan. Berikan kode ini ke perangkat:",
        copyableText: code,
        footer: `Berlaku sampai: ${formattedExpires}`,
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Tutup",
        confirmButtonColor: "primary" as DaisyColor,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      setLoading(false);
      await handleApiError(
        err,
        "Terjadi kesalahan saat menerbitkan kode enrollment",
      );
    }
  };

  return { createEnrollmentCode, loading };
}
