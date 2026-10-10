import axios from "axios";

export interface ApiErrorPayload {
  message?: string;
  error?: unknown;
  status?: number | string;
  code?: string;
  errors?: unknown;
  data?: unknown;
}

export class ApiError extends Error {
  status?: number;
  code?: string;
  errors?: unknown;
  data?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      errors?: unknown;
      data?: unknown;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = options.status;
    this.code = options.code;
    this.errors = options.errors;
    this.data = options.data;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const responseData: unknown = error.response?.data;
    const payload = isRecord(responseData) ? responseData : {};

    // Ambil meta jika ada (untuk struktur backend yang membungkus di dalam meta)
    const meta = isRecord(payload.meta) ? payload.meta : {};

    const message =
      (typeof meta.message === "string" && meta.message) || // <-- Cek meta.message dulu (untuk Patient Verification)
      (typeof payload.message === "string" && payload.message) ||
      (typeof payload.error === "string" && payload.error) ||
      error.message ||
      "Terjadi kesalahan saat menghubungi server.";

    return new ApiError(message, {
      status: error.response?.status,
      code:
        typeof meta.code === "number" || typeof meta.code === "string"
          ? String(meta.code)
          : typeof payload.code === "string"
            ? payload.code
            : error.code,
      errors: payload.errors,
      data: payload.data,
    });
  }

  if (error instanceof Error) {
    return new ApiError(error.message);
  }

  return new ApiError("Terjadi kesalahan yang tidak diketahui.");
}
