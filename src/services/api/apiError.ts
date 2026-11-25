import axios from "axios";

export interface ApiErrorPayload {
  message?: string;
  error?: unknown;
  status?: number | string;
  code?: string;
  errors?: unknown;
  data?: unknown;
  meta?: {
    message?: string;
    error?: string;
    code?: number;
    status?: string;
  };
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

    const meta = isRecord(payload.meta) ? payload.meta : {};

    let message =
      (typeof meta.message === "string" && meta.message) ||
      (typeof meta.error === "string" && meta.error) ||
      (typeof payload.message === "string" && payload.message) ||
      (typeof payload.error === "string" && payload.error) ||
      error.message ||
      "Terjadi kesalahan saat menghubungi server.";

    // Tangani error khusus jika terdapat 'empty_processes' di dalam payload.data
    const errorData = payload.data;
    if (isRecord(errorData)) {
      if (Array.isArray(errorData.empty_processes)) {
        // Ambil nama-nama process yang kosong dari array
        const processNames = errorData.empty_processes
          .map((p: any) => p.name)
          .filter(Boolean)
          .join(", ");

        if (processNames) {
          message = `${message} (${processNames})`;
        }
      } else {
        // Penanganan umum untuk objek data lainnya (jika ada)
        const detailedMessages: string[] = [];
        for (const [, val] of Object.entries(errorData)) {
          if (Array.isArray(val)) {
            detailedMessages.push(`${val.join(", ")}`);
          } else if (typeof val === "string") {
            detailedMessages.push(`${val}`);
          }
        }
        if (detailedMessages.length > 0) {
          message = `${message} | ${detailedMessages.join(" | ")}`;
        }
      }
    }

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
