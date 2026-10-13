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

// Station Page
const StationPage = lazy(() => import("@iptv/pages/station/StationPage"));
const StationFormPage = lazy(
  () => import("@iptv/pages/station/StationFormPage"),
);

// Master Page
const WardPage = lazy(() => import("@iptv/pages/master/ward/WardPage"));
const WardFormPage = lazy(() => import("@iptv/pages/master/ward/WardFormPage"));
const RoomPage = lazy(() => import("@iptv/pages/master/room/RoomPage"));
const RoomFormPage = lazy(() => import("@iptv/pages/master/room/RoomFormPage"));
const BedPage = lazy(() => import("@iptv/pages/master/bed/BedPage"));

// User Page
const UserPage = lazy(() => import("@iptv/pages/user/UserPage"));
const UserFormPage = lazy(() => import("@iptv/pages/user/UserFormPage"));
const UserDetailPage = lazy(() => import("@iptv/pages/user/UserDetailPage"));
const UserResetPasswordPage = lazy(
  () => import("@iptv/pages/user/UserResetPasswordPage"),
);

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
      children: [
        { index: true, element: <StationPage /> },
        { path: "create", element: <StationFormPage /> },
      ],
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
      path: "bed",
      children: [{ index: true, element: <BedPage /> }],
    },
    {
      path: "user",
      children: [
        { index: true, element: <UserPage /> },
        { path: "create", element: <UserFormPage /> },
        { path: ":userId", element: <UserDetailPage /> },
        { path: ":userId/edit", element: <UserFormPage /> },
        { path: ":userId/reset-password", element: <UserResetPasswordPage /> },
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
