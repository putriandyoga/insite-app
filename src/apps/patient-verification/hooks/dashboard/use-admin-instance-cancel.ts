// hooks/instances/use-admin-instance-cancel.ts
import { useState } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useAdminInstanceCancel(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const cancelInstance = async (id: string | number) => {
    // 1. Munculkan prompt untuk mengisi alasan pembatalan
    const reason = await showAlert({
      title: "Batalkan Instance Verifikasi",
      text: "Masukkan alasan pembatalan instance ini:",
      input: "text",
      inputPlaceholder: "Contoh: Pasien batal pulang, kondisi memburuk...",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Batalkan",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value || !value.trim()) return "Alasan pembatalan wajib diisi!";
      },
    });

    if (typeof reason !== "string" || !reason.trim()) return;

    try {
      setLoading(true);
      // Tembak endpoint POST /instances/:id/cancel
      await instancesService.cancel(id, { reason: reason.trim() });

      await showAlert({
        title: "Berhasil!",
        text: "Instance berhasil dibatalkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // Invalidate queries agar data ter-refresh otomatis
      queryClient.invalidateQueries({ queryKey: queryKeys.instances.lists() });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat membatalkan instance");
    } finally {
      setLoading(false);
    }
  };

  return { cancelInstance, loading };
}
