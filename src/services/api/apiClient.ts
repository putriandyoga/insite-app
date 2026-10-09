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
    loginPath = "/login",
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

  api.interceptors.request.use((request) => {
    if (typeof window === "undefined") return request;

    try {
      const storedUser = localStorage.getItem(tokenStorageKey);

      if (storedUser) {
        const parsedUser = decrypt<{ token?: string }>(storedUser);

        if (parsedUser?.token) {
          request.headers.set("Authorization", `Bearer ${parsedUser.token}`);
        }
      }
    } catch (error) {
      // Jangan menggagalkan request hanya karena token lokal gagal dibaca.
      console.warn("Gagal membaca token lokal.", error);
    }

    return request;
  });

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

        if (window.location.pathname !== loginPath) {
          window.location.assign(loginPath);
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
