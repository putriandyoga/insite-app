import { useBaseLogin } from "@/hooks/core/use-base-login";
import { patientAuthService } from "@patient-verification/services/patientVerificationAuthService";

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
      return await patientAuthService.login(payload);
    },

    transformUser: (result) => ({
      id: result.user.id.toString(),
      username: result.user.username,
      email:
        result.user.email !== "null" && result.user.email
          ? result.user.email
          : `${result.user.username}@hospital.local`,
      token: result.token,
      role: result.user.role,
      permissions: [],
      departemen_id: result.user.departemen_id,
    }),

    redirectTo: "/app/patient-verification/dashboard",
  });
}
