import { getEnv } from "@/config/env";
import { createApiClient } from "./apiClient";

export const authApi = createApiClient(getEnv("VITE_AUTH_API", "/api/v1"));

export const mcuApi = createApiClient(getEnv("VITE_MCU_API", "/api/mcu"));

// export const iptvApi = createApiClient(
//   import.meta.env.DEV ? "/iptv-api" : getEnv("VITE_IPTV_API", ""),
//   {
//     withCredentials: true,
//     useLocalStorageToken: false,
//     tokenCookieName: "pulser_user_session", // <-- Mengambil Bearer token dari cookie ini
//     loginPath: "/app/iptv/login", // <-- Jika 401, lari ke login IPTV, bukan portal utama
//   },
// );
export const iptvApi = createApiClient(
  import.meta.env.DEV ? "/iptv-api" : getEnv("VITE_IPTV_API", ""),
  {
    withCredentials: true,
    useLocalStorageToken: false,
    loginPath: "/app/iptv/login",
  },
);

// --- SISIPKAN KEY AKTIF ANDA DI SINI SEMENTARA ---
// iptvApi.api.interceptors.request.use((request) => {
//   request.headers.set(
//     "Authorization",
//     "Bearer whzmuj76Mh1Drf3_PUMigrTT-Lv5pwWvi103zBYdvuM",
//   );
//   return request;
// });
export const patientApi = createApiClient(
  getEnv("VITE_PATIENT_API", "/api/patient"),
);
