import CryptoJS from "crypto-js";
import { getEnv } from "../config/env";

const STORAGE_KEY = getEnv("VITE_STORAGE_SECRET");

// fallback biar app tidak crash
if (!STORAGE_KEY) {
  console.warn("VITE_STORAGE_SECRET is not defined");
}

export function encrypt<T>(data: T): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), STORAGE_KEY).toString();
}

export function decrypt<T>(cipherText: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, STORAGE_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch {
    return null;
  }
}
