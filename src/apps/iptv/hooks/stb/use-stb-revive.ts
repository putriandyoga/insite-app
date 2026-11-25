import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbRevive(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const reviveStb = async (id: string) => {
    const result = await showAlert({
      title: "Hidupkan Kembali (Revive) STB?",
      text: "Perangkat akan diaktifkan kembali.",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Revive",
      confirmButtonColor: "success" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.revive(id);

      await showAlert({
        title: "Berhasil!",
        text: "Perangkat berhasil di-revive.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat revive perangkat");
    } finally {
      setLoading(false);
    }
  };

  return { reviveStb, loading };
}
