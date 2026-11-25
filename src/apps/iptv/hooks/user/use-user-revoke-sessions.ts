import { useState } from "react";
import { userService } from "@iptv/services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useUserRevokeSessions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const revokeSessions = async (userId: string) => {
    const result = await showAlert({
      title: "Cabut Sesi Aktif?",
      text: "Tindakan ini akan mengeluarkan user dari semua perangkat yang sedang aktif (Force Logout).",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Cabut Sesi",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await userService.revokeSessions(userId);

      await showAlert({
        title: "Berhasil!",
        text: "Semua sesi aktif user berhasil dicabut.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.user.detail(userId),
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mencabut sesi user");
    } finally {
      setLoading(false);
    }
  };

  return { revokeSessions, loading };
}
