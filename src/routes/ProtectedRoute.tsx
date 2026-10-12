// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import type { ReactNode } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import { IndicatorLoading } from "@/components/IndicatorLoading";

// interface ProtectedRouteProps {
//   children?: ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { token, loading } = useAuthStore();
//   const location = useLocation();

//   if (loading) {
//     return <IndicatorLoading fullscreen text="Memeriksa Otentikasi..." />;
//   }

//   // Pengecualian khusus: Jika ini adalah rute modul IPTV,
//   // karena IPTV menggunakan sistem Cookie, kita izinkan lewat atau
//   // berikan penanganan khusus jika token Zustand kosong.
//   const isIptvRoute = location.pathname.startsWith("/app/iptv");

//   // Jika tidak ada token Zustand DAN bukan rute IPTV berbasis cookie, lempar ke login/portal
//   if (!token && !isIptvRoute) {
//     return <Navigate to="/nanana" replace />;
//   }

//   // Jika lewat jalur IPTV tapi ingin proteksi ekstra berbasis cookie,
//   // pastikan API IPTV Anda menangani interceptor 401 (Unauthorized)
//   // yang akan otomatis redirect jika cookienya sudah expired/tidak valid.

//   return <>{children ?? <Outlet />}</>;
// }
import { Navigate, Outlet } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { IndicatorLoading } from "@/components/IndicatorLoading";

interface ProtectedRouteProps {
  children?: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token, loading } = useAuthStore();

  if (loading) {
    return <IndicatorLoading fullscreen text="Memeriksa Otentikasi..." />;
  }

  // Jika tidak ada token sama sekali di Zustand, lempar ke halaman login / rute portal
  if (!token) {
    return <Navigate to="/nanana" replace />;
  }

  return <>{children ?? <Outlet />}</>;
}
