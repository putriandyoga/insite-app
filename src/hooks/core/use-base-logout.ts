// C:\Project\Production\insite-react\src\hooks\core\useBaseLogout.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { showAlert } from "@/components/Alert";

interface UseBaseLogoutOptions {
  logoutFn?: () => Promise<unknown>;
  redirectTo?: string;
  successTitle?: string;
  successText?: string;
}

export function useBaseLogout({
  logoutFn,
  redirectTo = "/login",
  successTitle = "Berhasil Keluar",
  successText = "Anda telah keluar dari sistem.",
}: UseBaseLogoutOptions = {}) {
  const navigate = useNavigate();
  const { logout: clearStore } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // 1. Tembak API logout backend jika disediakan (opsional untuk cookie/token cleanup)
      if (logoutFn) {
        await logoutFn();
      }
    } catch (err: unknown) {
      // Walaupun API logout gagal (misal network error / token expired),
      // kita tetap harus membersihkan local session demi keamanan user.
      console.warn("Gagal menghubungi server saat logout:", err);
    } finally {
      // 2. Bersihkan state Zustand & localStorage
      clearStore();
      setLoading(false);

      // 3. Tampilkan pesan dan arahkan ke halaman login
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

  return {
    logout: handleLogout,
    loading,
  };
}
