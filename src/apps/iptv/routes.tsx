import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";

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
const StationFormPage = lazy(
  () => import("@iptv/pages/station/StationFormPage"),
);

const WardPage = lazy(() => import("@iptv/pages/master/ward/WardPage"));
const WardFormPage = lazy(() => import("@iptv/pages/master/ward/WardFormPage"));
const RoomPage = lazy(() => import("@iptv/pages/master/room/RoomPage"));
const RoomFormPage = lazy(() => import("@iptv/pages/master/room/RoomFormPage"));
const BedPage = lazy(() => import("@iptv/pages/master/bed/BedPage"));

const UserPage = lazy(() => import("@iptv/pages/user/UserPage"));
const UserFormPage = lazy(() => import("@iptv/pages/user/UserFormPage"));
const UserDetailPage = lazy(() => import("@iptv/pages/user/UserDetailPage"));
const UserResetPasswordPage = lazy(
  () => import("@iptv/pages/user/UserResetPasswordPage"),
);

const StbPage = lazy(() => import("@iptv/pages/stb/StbPage"));
const StbFormPage = lazy(() => import("@iptv/pages/stb/StbFormPage"));
const StbBindPage = lazy(() => import("@iptv/pages/stb/StbBindPage"));
const StbDetailPage = lazy(() => import("@iptv/pages/stb/StbDetailPage"));

const PanelPage = lazy(() => import("@iptv/pages/panel/NurseCallMonitor"));

export const iptvRoutes: RouteObject = {
  path: "iptv",
  element: <IptvSyncWrapper />,
  children: [
    { index: true, element: <StationPage /> },
    {
      path: "dashboard",
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
      path: "stb",
      children: [
        { index: true, element: <StbPage /> },
        { path: "create", element: <StbFormPage /> },
        { path: ":stbId", element: <StbDetailPage /> },
        { path: ":stbId/bind", element: <StbBindPage /> },
      ],
    },
    {
      path: "panel",
      children: [
        { index: true, element: <PanelPage /> },
        { path: "create", element: <StbFormPage /> },
        { path: ":stbId", element: <StbDetailPage /> },
        { path: ":stbId/bind", element: <StbBindPage /> },
      ],
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
