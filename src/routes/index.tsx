import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { IndicatorLoading } from "@/components/IndicatorLoading";

// Rute & Layout Pendukung
import GuestRoute from "./GuestRoute";
import PermissionRoute from "./PermissionRoute";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "@/layout/DashboardLayout";

// Sub-apps (di-uncomment jika sudah siap digunakan)
// import { casesRoutes } from "@cases/routes";
// import { eventRoutes } from "@event/routes";
// import { ticketingRoutes } from "@ticketing/routes";
// import { surveyRoutes } from "@survey/routes";
// import { queueRoutes } from "@queue/routes";

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

const DashboardPage = Loadable(lazy(() => import("@/pages/DashboardPage")));

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      // { path: "/login", element: <LoginPage /> },
      // { path: "/login/antrian", element: <LoginQueuePage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PermissionRoute />,
        children: [
          {
            path: "/login",
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: "dashboard", element: <DashboardPage /> },

              // Sub-apps (aktifkan kembali baris di bawah jika modulnya sudah di-import)
              // casesRoutes,
              // eventRoutes,
              // ticketingRoutes,
              // surveyRoutes,
              // queueRoutes,
            ],
          },
        ],
      },
    ],
  },
  // { path: "*", element: <NotFoundPage /> },
]);
