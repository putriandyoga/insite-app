import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { getCurrentUser } from "@/utils/authHelper";

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: "admin" | "nurse" | string; // Opsional: batasi role tertentu jika diperlukan
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { token, loading } = useAuthStore();

  if (loading) {
    return <IndicatorLoading fullscreen text="Memeriksa Otentikasi..." />;
  }

  // 1. Jika tidak ada token, arahkan ke halaman login sesuai modul aktif
  if (!token) {
    const loginPath = location.pathname.startsWith("/app/patient-verification")
      ? "/app/patient-verification/login"
      : "/app/iptv/login";
    return <Navigate to={loginPath} replace />;
  }

  // 2. (Opsional) Jika rute ini memerlukan role khusus (misal: "admin")
  if (requiredRole) {
    const user = getCurrentUser<any>();
    const userRole = String(user?.role || "").toLowerCase();

    if (userRole !== requiredRole.toLowerCase()) {
      // Jika user bukan admin tapi mencoba akses halaman admin, lempar ke /401
      return <Navigate to="/401" replace />;
    }
  }

  return <>{children ?? <Outlet />}</>;
}
