import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";

import { decrypt } from "@/utils/secureStorage";
import { getEnv } from "@/config/env";
import { normalizeApiError } from "./apiError";

interface CreateApiClientOptions {
  withCredentials?: boolean;
  handleUnauthorized?: boolean;
  tokenStorageKey?: string;
  loginPath?: string;
  useLocalStorageToken?: boolean;
  tokenCookieName?: string; // Nama cookie yang menyimpan token
}

// Helper untuk membaca nilai cookie berdasarkan nama di sisi client
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export interface ApiClient {
  api: AxiosInstance;

  apiRequest<T = unknown>(
    method: Method,
    url: string,
    data?: unknown,
    requestConfig?: AxiosRequestConfig,
  ): Promise<T>;

  getCsrfCookie(): Promise<void>;
}

export function createApiClient(
  baseURL: string,
  options: CreateApiClientOptions = {},
): ApiClient {
  const {
    withCredentials = false,
    handleUnauthorized = true,
    tokenStorageKey = "user",
    loginPath = "/",
    useLocalStorageToken = true,
    tokenCookieName,
  } = options;

  const api = axios.create({
    baseURL: baseURL || undefined,
    withCredentials,
    headers: {
      Accept: "application/json",
    },
  });

  const getCsrfCookie = async (): Promise<void> => {
    const sanctumBaseURL = getEnv("VITE_SANCTUM_API");

    if (!sanctumBaseURL) {
      throw new Error("VITE_SANCTUM_API belum dikonfigurasi.");
    }

    try {
      await axios.get(`${sanctumBaseURL.replace(/\/+$/, "")}/csrf-cookie`, {
        withCredentials: true,
        headers: { Accept: "application/json" },
      });
    } catch (error) {
      throw normalizeApiError(error);
    }
  };

  // Request Interceptor: Menambahkan Authorization Bearer secara dinamis (Cookie / LocalStorage)
  api.interceptors.request.use((request) => {
    if (typeof window === "undefined") return request;

    try {
      // 1. Jika tokenCookieName diset, ambil token langsung dari Cookie browser
      if (tokenCookieName) {
        const cookieToken = getCookie(tokenCookieName);
        if (cookieToken) {
          request.headers.set("Authorization", `Bearer ${cookieToken}`);
        }
      }
      // 2. Jika menggunakan localStorage dan diizinkan, ambil dari storage
      else if (useLocalStorageToken) {
        const storedUser = localStorage.getItem(tokenStorageKey);

        if (storedUser) {
          const parsedUser = decrypt<{ token?: string }>(storedUser);

          if (parsedUser?.token) {
            request.headers.set("Authorization", `Bearer ${parsedUser.token}`);
          }
        }
      }
    } catch (error) {
      console.warn("Gagal membaca token otentikasi.", error);
    }

    return request;
  });

  // Response Interceptor: Menangani 401 Unauthorized
  api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (
        handleUnauthorized &&
        axios.isAxiosError(error) &&
        error.response?.status === 401 &&
        typeof window !== "undefined"
      ) {
        try {
          localStorage.removeItem(tokenStorageKey);
        } catch {
          // Storage mungkin tidak tersedia di lingkungan tertentu.
        }

        if (
          window.location.pathname !== "/401" &&
          window.location.pathname !== loginPath
        ) {
          window.location.assign("/401");
        }
      }

      return Promise.reject(normalizeApiError(error));
    },
  );

  const apiRequest: ApiClient["apiRequest"] = async <T>(
    method: Method,
    url: string,
    data?: unknown,
    requestConfig?: AxiosRequestConfig,
  ): Promise<T> => {
    const response = await api.request<T>({
      ...requestConfig,
      method,
      url,
      data,
    });

    return response.data;
  };

  return { api, apiRequest, getCsrfCookie };
}
