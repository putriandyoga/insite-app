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
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@apps": path.resolve(__dirname, "./src/apps"),
      "@iptv": path.resolve(__dirname, "./src/apps/iptv"),
      "@patient-verification": path.resolve(
        __dirname,
        "./src/apps/patient-verification",
      ),
    },
  },
});
