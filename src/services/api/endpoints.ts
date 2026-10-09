import { getEnv } from "@/config/env";
import { createApiClient } from "./apiClient";

export const authApi = createApiClient(getEnv("VITE_AUTH_API", "/api/v1"));

export const mcuApi = createApiClient(getEnv("VITE_MCU_API", "/api/mcu"));

export const iptvApi = createApiClient(getEnv("VITE_IPTV_API", ""), {
  withCredentials: true, // PENTING agar cookie dikirim dan diterima oleh browser
});
export const patientApi = createApiClient(
  getEnv("VITE_PATIENT_API", "/api/patient"),
);
