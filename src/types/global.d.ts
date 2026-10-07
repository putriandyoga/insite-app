export {};

declare global {
  interface Window {
    configs: {
      VITE_AUTH_API?: string;
      VITE_SERVICE_API?: string;
      VITE_EVENT_API?: string;
      VITE_SURVEY_API?: string;
      VITE_MCU_API?: string;
      VITE_QUEUE_API?: string;
      VITE_SURVEY_CLIENT_URL?: string;
      VITE_QUEUE_CLIENT_URL?: string;
      VITE_STORAGE_SECRET?: string;
      VITE_LOGIN_EMAIL?: string;
      VITE_LOGIN_PASSWORD?: string;
      VITE_AUTH_API_MOCK?: string;
      VITE_MAIN_ADMIN_EMAIL?: string;
      VITE_MAIN_PERAWAT_EMAIL?: string;
      VITE_MAIN_REGISTRASI_EMAIL?: string;
      VITE_MAIN_ADMIN_PASSWORD?: string;
      VITE_MAIN_PERAWAT_PASSWORD?: string;
      VITE_MAIN_REGISTRASI_PASSWORD?: string;
      VITE_USE_MOCK_API?: string;
      [key: string]: string | undefined;
    };
  }
}
