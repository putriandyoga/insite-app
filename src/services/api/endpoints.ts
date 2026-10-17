import { getEnv } from "@/config/env";
import { createApiClient } from "./apiClient";

export const authApi = createApiClient(getEnv("VITE_AUTH_API", "/api/v1"));

export const iptvApi = createApiClient(
  import.meta.env.DEV ? "/iptv-api" : getEnv("VITE_IPTV_API", ""),
  {
    withCredentials: false,
    useLocalStorageToken: true,
    tokenStorageKey: "user",
    loginPath: "/app/iptv/login",
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

export const patientVerificationApi = createApiClient(
  import.meta.env.DEV
    ? "/patient-api"
    : getEnv("VITE_PATIENT_VERIFICATION_API", ""),
  {
    withCredentials: false,
    useLocalStorageToken: true,
    tokenStorageKey: "user",
    loginPath: "/app/patient-verification/login",
  },
);
