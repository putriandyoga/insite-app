import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
// import PermissionRoute from "@/routes/PermissionRoute"; // <-- Matikan ini
import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { useIptvLogout } from "./hooks/auth/use-logout";

function IptvSyncWrapper() {
  const { logout } = useIptvLogout();
  return (
    <>
      <ModuleLogoutSync moduleName="iptv" logoutFn={logout} />
      <Outlet />
    </>
  );
}

const StationPage = lazy(() => import("@iptv/pages/station/StationPage"));

// Master Page
const WardPage = lazy(() => import("@iptv/pages/master/ward/WardPage"));
const WardFormPage = lazy(() => import("@iptv/pages/master/ward/WardFormPage"));
const RoomPage = lazy(() => import("@iptv/pages/master/room/RoomPage"));
const RoomFormPage = lazy(() => import("@iptv/pages/master/room/RoomFormPage"));

export const iptvRoutes: RouteObject = {
  path: "iptv",
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
      path: "ward",
      children: [
        { index: true, element: <WardPage /> },
        { path: "create", element: <WardFormPage /> },
        // { path: ":wardId/edit", element: <WardFormPage /> },
      ],
    },
    {
      path: "room",
      children: [
        { index: true, element: <RoomPage /> },
        { path: "create", element: <RoomFormPage /> },
      ],
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
