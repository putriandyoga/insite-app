import { iptvAuthService } from "@iptv/services/iptvAuthService";
import { useBaseLogin } from "@/hooks/core/use-base-login";

export function useLogin() {
  return useBaseLogin({
    loginFn: async (payload: { username: string; password: string }) => {
      // 1. Hapus data sesi lama di localStorage sebelum proses login baru
      try {
        localStorage.removeItem("user");
        // Tambahkan key storage lain jika ada yang perlu dibersihkan
      } catch (error) {
        console.warn("Gagal membersihkan storage lama:", error);
      }

      // 2. Lanjutkan proses request login ke API
      return await iptvAuthService.login(payload);
    },
    transformUser: (result) => ({
      id: result.user.id,
      email: `${result.user.username}`,
      token: result.token,
      role: result.user.role,
      permissions: [],
    }),
    redirectTo: "/app/iptv/dashboard",
  });
}
