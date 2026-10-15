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
