import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbRevoke(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const revokeStb = async (id: string, note: string) => {
    const result = await showAlert({
      title: "Revoke STB?",
      text: "Apakah Anda yakin ingin mencabut (revoke) perangkat ini?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Revoke",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.revoke(id, note); // Meneruskan parameter note ke service

      await showAlert({
        title: "Berhasil!",
        text: "Perangkat berhasil direvoke.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat revoke perangkat");
    } finally {
      setLoading(false);
    }
  };

  return { revokeStb, loading };
}
