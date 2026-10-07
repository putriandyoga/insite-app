import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
