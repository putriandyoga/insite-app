import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, type UserData } from "@/store/useAuthStore";
import { ApiError } from "@/services/api/apiError";
import { showAlert } from "@/utils/showAlert";

interface UseBaseLoginOptions<TPayload, TResult> {
  loginFn: (payload: TPayload) => Promise<TResult>;
  transformUser?: (result: TResult, payload: TPayload) => UserData;
  redirectTo?: string;
  successTitle?: string;
  successText?: string;
}

export function useBaseLogin<TPayload, TResult>({
  loginFn,
  transformUser,
  redirectTo = "/dashboard",
  successTitle = "Login Berhasil",
  successText = "Selamat datang kembali!",
}: UseBaseLoginOptions<TPayload, TResult>) {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (payload: TPayload) => {
    setLoading(true);
    try {
      const result = await loginFn(payload);

      let userData: UserData;
      if (transformUser) {
        userData = transformUser(result, payload);
      } else {
        userData = {
          id: "",
          email: "",
          token: "COOKIE_SESSION_ACTIVE",
          role: "admin",
          permissions: [],
          ...(result as any),
        };
      }

      login(userData.token, userData);

      await showAlert({
        title: successTitle,
        text: successText,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        onClose: () => navigate(redirectTo),
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : "Terjadi kesalahan saat menghubungi server.";

      await showAlert({
        title: "Login Gagal",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Coba Lagi",
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    login: handleLogin,
    loading,
  };
}
