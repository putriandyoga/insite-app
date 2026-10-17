import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/iptv-api": {
        target: "http://192.168.101.207:3020",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/iptv-api/, ""),
      },
      "/panel": {
        target: "http://192.168.101.207:3020",
        changeOrigin: true,
        secure: false,
      },
      "/patient-api": {
        target: "http://192.168.19.21:2024/api/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/patient-api/, ""),
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@apps": path.resolve(import.meta.dirname, "./src/apps"),
      "@iptv": path.resolve(import.meta.dirname, "./src/apps/iptv"),
      "@patient-verification": path.resolve(
        import.meta.dirname,
        "./src/apps/patient-verification",
      ),
    },
  },
});
