import { getEnv } from "@/config/env";
import { createApiClient } from "./apiClient";

export const authApi = createApiClient(getEnv("VITE_AUTH_API", "/api/v1"));

export const iptvApi = createApiClient(
  import.meta.env.DEV ? "/iptv-api" : getEnv("VITE_IPTV_API", ""),
  {
    withCredentials: false,
    useLocalStorageToken: true, // Mengaktifkan pembacaan token dari localStorage
    tokenStorageKey: "user", // Sesuaikan dengan key storage auth IPTV / aplikasi Anda (misal: "user" atau "auth-storage")
    loginPath: "/app/iptv/login", // Jalur redirect saat 401 Unauthorized
  },
);
// IPTV with cookies
// export const iptvApi = createApiClient(
//   import.meta.env.DEV ? "/iptv-api" : getEnv("VITE_IPTV_API", ""),
//   {
//     withCredentials: true,
//     useLocalStorageToken: false,
//     loginPath: "/app/iptv/login",
//   },
// );

// // --- Interceptor sementara IPTV ---
// iptvApi.api.interceptors.request.use((request) => {
//   request.headers.set(
//     "Authorization",
//     "Bearer whzmuj76Mh1Drf3_PUMigrTT-Lv5pwWvi103zBYdvuM",
//   );
//   return request;
// });

// --- API PATIENT VERIFICATION ---
export const patientVerificationApi = createApiClient(
  import.meta.env.DEV
    ? "/patient-api"
    : getEnv("VITE_PATIENT_VERIFICATION_API", ""),
  {
    withCredentials: false,
    useLocalStorageToken: true, // Karena menggunakan token dari respons API (Bearer token)
    tokenStorageKey: "patient_verification_token", // Kunci penyimpanan token di localStorage
    loginPath: "/app/patient-verification/login", // Jalur redirect saat 401 Unauthorized
  },
);
