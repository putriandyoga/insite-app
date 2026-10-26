// import { Navigate, Outlet } from "react-router-dom";
// import type { ReactNode } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import { IndicatorLoading } from "@/components/IndicatorLoading";

// interface ProtectedRouteProps {
//   children?: ReactNode;
// }

// export default function ProtectedRoute({ children }: ProtectedRouteProps) {
//   const { token, loading } = useAuthStore();

//   if (loading) {
//     return <IndicatorLoading fullscreen text="Memeriksa Otentikasi..." />;
//   }

//   // Jika tidak ada token sama sekali di Zustand, lempar ke halaman login / rute portal
//   if (!token) {
//     return <Navigate to="/nanana" replace />;
//   }

//   return <>{children ?? <Outlet />}</>;
// }
import { Navigate, Outlet } from "react-router-dom";
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
  const { token, loading } = useAuthStore();

  if (loading) {
    return <IndicatorLoading fullscreen text="Memeriksa Otentikasi..." />;
  }

  // 1. Jika tidak ada token, arahkan ke halaman login (Ganti "/nanana" dengan "/login" atau rute login Anda)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. (Opsional) Jika rute ini memerlukan role khusus (misal: "admin")
  if (requiredRole) {
    const user = getCurrentUser<any>();
    const userRole = String(user?.role || "").toLowerCase();

    if (userRole !== requiredRole.toLowerCase()) {
      // Jika user bukan admin tapi mencoba akses halaman admin, lempar ke dashboard utama
      return <Navigate to="/401" replace />;
    }
  }

  return <>{children ?? <Outlet />}</>;
}
