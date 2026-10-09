import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type Method,
} from "axios";

export interface HttpClient {
  request: <T>(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) => Promise<T>;
}

export const createHttpClient = (baseURL: string): HttpClient => {
  const instance: AxiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Contoh Interceptor untuk Auth Token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return {
    async request<T>(
      method: Method,
      url: string,
      data?: any,
      config?: AxiosRequestConfig,
    ): Promise<T> {
      const response = await instance.request<T>({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    },
  };
};
