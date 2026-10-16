import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { IndicatorLoading } from "@/components/IndicatorLoading";

export default function GuestRoute() {
  const { token, loading } = useAuthStore();

  if (loading) {
    return <IndicatorLoading />;
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
