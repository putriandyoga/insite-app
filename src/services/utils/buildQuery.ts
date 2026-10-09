// src/services/utils/buildQuery.ts
export const buildQuery = (params?: Record<string, any>) => {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Abaikan jika kosong, null, atau undefined
    if (value === undefined || value === null || value === "") return;

    // Jika suatu saat ada yang mengirim key "filters" berupa objek, ratakan (flat) ke URL utama
    if (key === "filters" && typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([fKey, fValue]) => {
        if (fValue !== undefined && fValue !== null && fValue !== "") {
          query.append(fKey, String(fValue));
        }
      });
      return;
    }

    // Cegah objek tak dikenal menjadi [object Object]
    if (
      typeof value === "object" &&
      !(value instanceof Date) &&
      !Array.isArray(value)
    ) {
      return;
    }

    // Handle array (jika ada)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== "") {
          query.append(`${key}[]`, String(item));
        }
      });
      return;
    }

    // Masukkan parameter primitif (string, number, boolean) secara flat
    query.append(key, String(value));
  });

  return query.toString();
};
