import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
// import PermissionRoute from "@/routes/PermissionRoute"; // <-- Matikan ini
import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { useIptvLogout } from "./hooks/auth/use-logout";

function IptvSyncWrapper() {
  const { logout } = useIptvLogout();
  return (
    <>
      <ModuleLogoutSync moduleName="patient-verification" logoutFn={logout} />
      <Outlet />
    </>
  );
}

const StationPage = lazy(
  () => import("@patient-verification/pages/station/StationPage"),
);

export const patientVerificationRoutes: RouteObject = {
  path: "patient-verification",
  element: <IptvSyncWrapper />,
  children: [
    // Hapus atau comment wrapper PermissionRoute di sini
    { index: true, element: <StationPage /> },
    {
      path: "dashboard",
      // element: <DashboardPage />,
    },
    {
      path: "station",
      children: [{ index: true, element: <StationPage /> }],
    },
    {
      path: "device",
      children: [],
    },
    {
      path: "schedule",
      children: [],
    },
    {
      path: "log-history",
    },
  ],
};
