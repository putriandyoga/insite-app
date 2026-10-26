// src/utils/auth.ts
import { decrypt } from "@/utils/secureStorage";

// Mengambil data mentah user yang sedang login dari localStorage
export const getCurrentUser = <T = any>(): T | null => {
  try {
    const encryptedData = localStorage.getItem("user");
    if (!encryptedData) return null;

    const decrypted = decrypt<T>(encryptedData);
    return decrypted || null;
  } catch (error) {
    console.error("Gagal membaca data user:", error);
    return null;
  }
};

// Fungsi universal untuk mengambil role user dari modul apa saja
export const getUserRole = (): string => {
  const user = getCurrentUser<any>();
  return user?.role || user?.data?.role || "";
};

// Cek apakah user aktif adalah admin
export const useIsAdmin = (): boolean => {
  const role = getUserRole();
  return role.toLowerCase() === "admin";
};
