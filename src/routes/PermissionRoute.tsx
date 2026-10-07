import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { hasPermission } from "@/utils/hasPermission";
import { getRoutePermission } from "./matchRoutePermission";

export default function PermissionRoute() {
  const { user } = useAuthStore();
  const location = useLocation();

  const permission = getRoutePermission(location.pathname);

  if (permission && (!user || !hasPermission(user, permission))) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
