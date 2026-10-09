import { getEnv } from "@/config/env";
import { createHttpClient } from "./httpClient";

// Contoh multiple base URL
export const authApi = createHttpClient(getEnv("VITE_AUTH_API") || "/api/v1");
export const mcuApi = createHttpClient(getEnv("VITE_MCU_API") || "/api/mcu");
export const iptvApi = createHttpClient(getEnv("VITE_IPTV_API") || "");
export const patientApi = createHttpClient(
  getEnv("VITE_PATIENT_API") || "/api/patient",
);
