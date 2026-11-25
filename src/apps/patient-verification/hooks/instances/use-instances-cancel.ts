// hooks/instance/use-instance-cancel.ts
import { useState } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useInstanceCancel(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const cancelInstance = async (id: string | number) => {
    // Munculkan popup input alasan pembatalan
    const reason = (await showAlert({
      title: "Batalkan Instance?",
      text: "Masukkan alasan pembatalan verifikasi instance ini:",
      input: "text",
      inputPlaceholder: "Contoh: Pasien batal pulang, kondisi memburuk",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Batalkan",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
      inputValidator: (value: string) => {
        if (!value.trim()) return "Alasan pembatalan wajib diisi!";
      },
    })) as unknown as string;

    if (!reason || typeof reason !== "string" || !reason.trim()) return;

    try {
      setLoading(true);
      await instancesService.cancel(id, { reason: reason.trim() });

      await showAlert({
        title: "Berhasil!",
        text: "Instance verifikasi berhasil dibatalkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.instances?.lists?.() ?? ["instances"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.instances?.detail?.(String(id)) ?? [
          "instances",
          String(id),
        ],
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat membatalkan instance");
    } finally {
      setLoading(false);
    }
  };

  return { cancelInstance, loading };
}
