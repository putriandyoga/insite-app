export {};

declare global {
  interface Window {
    configs: {
      VITE_AUTH_API?: string;
      VITE_STORAGE_SECRET?: string;
      VITE_IPTV_API?: string;
      VITE_PATIENT_VERIFICATION_API?: string;
      [key: string]: string | undefined;
    };
  }
}
