import { useState } from "react";
import { userService } from "@iptv/services/userService";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useUserResetPassword(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (userId: string, newPassword: string) => {
    const result = await showAlert({
      title: "Reset Password User?",
      text: "Apakah Anda yakin ingin mereset password user ini?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Reset",
      confirmButtonColor: "warning" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);

      await userService.resetPassword(userId, newPassword);

      await showAlert({
        title: "Berhasil!",
        text: "Password user berhasil direset.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mereset password");
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}
