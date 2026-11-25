import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import { Loadable } from "@/components/Loadable";
import { Navigate } from "react-router-dom";
// Rute & Layout Pendukung
import GuestRoute from "./GuestRoute";
// import PermissionRoute from "./PermissionRoute"; // Dimatikan
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";
import PortalLayout from "@/layout/PortalLayout";
import { iptvRoutes } from "@/apps/iptv/router";
import { patientVerificationRoutes } from "@/apps/patient-verification/routes";

// Error page
const UnauthorizedPage = Loadable(
  lazy(() => import("@/pages/error/UnauthorizedPage")),
);

// Portal page
const PortalPage = Loadable(lazy(() => import("@/pages/PortalPage")));

// IPTV page
const IptvLoginPage = Loadable(
  lazy(() => import("@iptv/pages/auth/LoginPage")),
);

// Patient verification page
const PatientVerificationLoginPage = Loadable(
  lazy(() => import("@patient-verification/pages/auth/LoginPage")),
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
          {
            path: "/app/patient-verification/login",
            element: <PatientVerificationLoginPage />,
          },
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
              iptvRoutes, // Jalur /app/iptv/station
              patientVerificationRoutes,
            ],
          },
        ],
      },
    ],
  },
  { path: "/401", element: <UnauthorizedPage /> },
  { path: "*", element: <Navigate to="/" replace /> },
]);
