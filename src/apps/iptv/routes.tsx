import PermissionRoute from "@/routes/PermissionRoute";
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

// Lazy loading halaman-halaman modul IPTV secara terpusat & optimal
// const Dashboard = lazy(() => import("./pages/DashboardPage"));

// const ChannelPage = lazy(() => import("./pages/channel/ChannelPage"));
// const ChannelFormPage = lazy(() => import("./pages/channel/ChannelFormPage"));

// const DevicePage = lazy(() => import("./pages/device/DevicePage"));
// const DeviceFormPage = lazy(() => import("./pages/device/DeviceFormPage"));
// const DeviceControlPage = lazy(
//   () => import("./pages/device/DeviceControlPage"),
// );

// const SchedulePage = lazy(() => import("./pages/schedule/SchedulePage"));
// const ScheduleFormPage = lazy(
//   () => import("./pages/schedule/ScheduleFormPage"),
// );

// const LogHistoryPage = lazy(() => import("./pages/log-history/LogHistoryPage"));
// const LoginPage = lazy(() => import("@iptv/pages/auth/LoginPage"));
const StationPage = lazy(() => import("@iptv/pages/station/StationPage"));

export const iptvRoutes: RouteObject = {
  path: "iptv",
  children: [
    {
      element: <PermissionRoute />,
      children: [
        // {
        //   path: "login",
        //   element: <LoginPage />,
        // },
        { index: true, element: <StationPage /> },
        {
          path: "dashboard",
          // children: [{ index: true, element: <Dashboard /> }],
        },
        {
          path: "station",
          children: [
            { index: true, element: <StationPage /> },
            // { path: "create", element: <StationFormPage /> },
            // { path: ":stationId/edit", element: <StationFormPage /> },
          ],
        },
        {
          path: "device",
          children: [
            // { index: true, element: <DevicePage /> },
            // { path: "create", element: <DeviceFormPage /> },
            // { path: ":deviceId/edit", element: <DeviceFormPage /> },
            // { path: ":deviceId/control", element: <DeviceControlPage /> }, // Kontrol STB/Perangkat langsung
          ],
        },
        {
          path: "schedule",
          children: [
            // { index: true, element: <SchedulePage /> },
            // { path: "create", element: <ScheduleFormPage /> },
            // { path: ":scheduleId/edit", element: <ScheduleFormPage /> },
          ],
        },
        {
          path: "log-history",
          // children: [{ index: true, element: <LogHistoryPage /> }],
        },
      ],
    },
  ],
};
