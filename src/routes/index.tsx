import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { IndicatorLoading } from "@/components/IndicatorLoading";

// Rute & Layout Pendukung
import GuestRoute from "./GuestRoute";
// import PermissionRoute from "./PermissionRoute"; // Dimatikan
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import PortalLayout from "@/layout/PortalLayout";
import { iptvRoutes } from "@/apps/iptv/routes";

function Loadable<T extends React.ComponentType<any>>(
  Component: React.LazyExoticComponent<T>,
) {
  return function WrappedLoadable(props: React.ComponentProps<T>) {
    return (
      <Suspense
        fallback={<IndicatorLoading fullscreen text="Memuat Halaman..." />}
      >
        <Component {...props} />
      </Suspense>
    );
  };
}

// Error page
const UnauthorizedPage = Loadable(
  lazy(() => import("@/pages/error/UnauthorizedPage")),
);

// Portal page
const PortalPage = Loadable(lazy(() => import("@/pages/PortalPage")));
const DashboardPage = Loadable(lazy(() => import("@/pages/DashboardPage")));
const IptvLoginPage = Loadable(
  lazy(() => import("@iptv/pages/auth/LoginPage")),
);

export const router = createBrowserRouter([
  // 1. AREA GUEST / PUBLIK
  {
    element: <GuestRoute />,
    children: [
      {
        element: <PortalLayout />,
        children: [
          { path: "/", element: <PortalPage /> },
          { path: "/portal", element: <PortalPage /> },
          { path: "/app/iptv/login", element: <IptvLoginPage /> },
        ],
      },
    ],
  },

  // 2. AREA PROTECTED / SETELAH LOGIN
  {
    element: <ProtectedRoute />, // Pastikan ini aktif agar token terbaca & tidak terlempar
    children: [
      {
        // element: <PermissionRoute />, // <-- Dimatikan karena tidak digunakan
        children: [
          {
            path: "/app",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              iptvRoutes, // Jalur /app/iptv/station Anda aman di sini
            ],
          },
        ],
      },
    ],
  },
  { path: "/401", element: <UnauthorizedPage /> },
]);
