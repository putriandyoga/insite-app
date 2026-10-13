import { useState } from "react";
import { userService } from "@iptv/services/userService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useUserDisable(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const disableUser = async (userId: string) => {
    const result = await showAlert({
      title: "Nonaktifkan User?",
      text: "Apakah Anda yakin ingin menonaktifkan user ini? User tidak akan dapat login ke sistem.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Nonaktifkan",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await userService.disable(userId);

      await showAlert({
        title: "Berhasil!",
        text: "User berhasil dinonaktifkan.",
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
      await handleApiError(err, "Terjadi kesalahan saat menonaktifkan user");
    } finally {
      setLoading(false);
    }
  };

  return { disableUser, loading };
}
