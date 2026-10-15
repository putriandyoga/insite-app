import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ApiError } from "@/services/api/apiError";
import { showAlert } from "@/components/Alert";

interface UseBaseLogoutOptions {
  logoutFn?: () => Promise<unknown>;
  redirectTo?: string;
  successTitle?: string;
  successText?: string;
}

export function useBaseLogout({
  logoutFn,
  redirectTo = "/",
  successTitle = "Berhasil Keluar",
  successText = "Anda telah keluar dari sistem.",
}: UseBaseLogoutOptions = {}) {
  const navigate = useNavigate();
  const { logout: clearStore } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    const confirmResult = await showAlert({
      title: "Apakah Anda yakin ingin logout?",
      text: "Anda akan keluar dari aplikasi dan perlu login kembali untuk mengaksesnya.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Keluar",
      cancelButtonText: "Batal",
      onClose: () => {},
    });

    if (!confirmResult) return;

    setLoading(true);
    try {
      if (logoutFn) {
        await logoutFn();
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Terjadi kesalahan saat menghubungi server.";

      await showAlert({
        title: "Gagal Keluar",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
        showConfirmButton: true,
      });
      return;
    } finally {
      clearStore();
      setLoading(false);

      await showAlert({
        title: successTitle,
        text: successText,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        onClose: () => navigate(redirectTo, { replace: true }),
      });
    }
  };

  return { logout, loading };
}
