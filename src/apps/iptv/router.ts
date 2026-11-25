import { createElement, lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { DashboardRouter } from "@iptv/components/DashboardRouter";
import { IptvSyncWrapper } from "@iptv/components/IptvSyncWrapper";

const PanelPage = lazy(() => import("@iptv/pages/dashboard/DashboardPage"));

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

const CallPage = lazy(() => import("@iptv/pages/call/CallPage"));

export const iptvRoutes: RouteObject = {
  path: "iptv",
  element: createElement(IptvSyncWrapper),
  children: [
    // Dashboard dapat diakses semua user yang login (tampilannya otomatis menyesuaikan Admin/Nurse)
    { path: "dashboard", element: createElement(DashboardRouter) },

    // Rute di bawah ini dibungkus ProtectedRoute khusus admin
    {
      element: createElement(
        ProtectedRoute,
        { requiredRole: "admin" },
        createElement(Outlet),
      ),
      children: [
        {
          path: "station",
          children: [
            { index: true, element: createElement(StationPage) },
            { path: "create", element: createElement(StationFormPage) },
          ],
        },
        {
          path: "ward",
          children: [
            { index: true, element: createElement(WardPage) },
            { path: "create", element: createElement(WardFormPage) },
          ],
        },
        {
          path: "room",
          children: [
            { index: true, element: createElement(RoomPage) },
            { path: "create", element: createElement(RoomFormPage) },
          ],
        },
        {
          path: "bed",
          children: [{ index: true, element: createElement(BedPage) }],
        },
        {
          path: "user",
          children: [
            { index: true, element: createElement(UserPage) },
            { path: "create", element: createElement(UserFormPage) },
            { path: ":userId", element: createElement(UserDetailPage) },
            { path: ":userId/edit", element: createElement(UserFormPage) },
            {
              path: ":userId/reset-password",
              element: createElement(UserResetPasswordPage),
            },
          ],
        },
        {
          path: "stb",
          children: [
            { index: true, element: createElement(StbPage) },
            { path: "create", element: createElement(StbFormPage) },
            { path: ":stbId", element: createElement(StbDetailPage) },
            { path: ":stbId/bind", element: createElement(StbBindPage) },
          ],
        },
        {
          path: "panel",
          children: [{ index: true, element: createElement(PanelPage) }],
        },
        {
          path: "call",
          children: [{ index: true, element: createElement(CallPage) }],
        },
      ],
    },
  ],
};
