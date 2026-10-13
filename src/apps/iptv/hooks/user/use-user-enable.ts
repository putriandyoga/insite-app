import { useState } from "react";
import { userService } from "@iptv/services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useUserEnable(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const enableUser = async (userId: string) => {
    const result = await showAlert({
      title: "Aktifkan User?",
      text: "Apakah Anda yakin ingin mengaktifkan kembali user ini?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Aktifkan",
      confirmButtonColor: "success" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await userService.enable(userId);

      await showAlert({
        title: "Berhasil!",
        text: "User berhasil diaktifkan kembali.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.user.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.detail(userId),
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mengaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  return { enableUser, loading };
}
