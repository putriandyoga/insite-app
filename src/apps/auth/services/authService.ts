// C:\Project\Production\insite-react\src\services\modules\authService.ts
import { authApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";
import { encrypt } from "@/utils/secureStorage"; // Sesuaikan path jika perlu

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    permissions: Array<{ id: string; name: string }>;
  };
}

export const authService = {
  async login(payload: { email: string; password: string }) {
    // 1. Hit API login
    const response = await authApi.apiRequest<unknown>(
      "POST",
      "/login",
      payload,
    );

    // 2. Ambil data bersih menggunakan normalizeDetail agar aman dari bungkus { data: ... }
    const data = normalizeDetail<LoginResponse>(response);

    // 3. Simpan token ke localStorage (sesuai key yang dibaca oleh interceptor apiClient)
    if (data?.access_token) {
      const tokenData = { token: data.access_token, user: data.user };
      localStorage.setItem("user", encrypt(tokenData)); // atau simpan sesuai tokenStorageKey Anda
    }

    return data;
  },

  async logout() {
    try {
      await authApi.apiRequest("POST", "/logout");
    } finally {
      localStorage.removeItem("user");
    }
  },
};
