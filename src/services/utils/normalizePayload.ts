// src/services/utils/normalizePayload.ts

export const normalizePayload = (payload: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item));
      });

      return;
    }

    formData.append(key, String(value ?? ""));
  });

  return formData;
};
