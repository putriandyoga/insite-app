import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";

import { router } from "./routes";
import { initThemeListener } from "./store/useThemeStore";
import { IndicatorLoading } from "./components/IndicatorLoading";

// Inisialisasi listener tema
initThemeListener();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 menit
      gcTime: 1000 * 60 * 10, // cache 10 menit
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Suspense
      fallback={<IndicatorLoading fullscreen text="Memuat Aplikasi..." />}
    >
      <RouterProvider router={router} />
    </Suspense>
  </QueryClientProvider>,
);
