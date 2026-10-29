import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
import { lazy } from "react";
import { Outlet, type RouteObject } from "react-router-dom";
import { useIptvLogout } from "./hooks/auth/use-logout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import { useIsAdmin } from "@/utils/authHelper";

function IptvSyncWrapper() {
  const { logout } = useIptvLogout();
  return (
    <>
      <ModuleLogoutSync moduleName="patient-verification" logoutFn={logout} />
      <Outlet />
    </>
  );
}
export const DashboardRouter = () => {
  const isAdmin = useIsAdmin();
  return isAdmin ? <ContextPage /> : <DashboardPage />;
};
const DepartementPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementPage"),
);
const DepartementFormPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementFormPage"),
);
const DepartementDetailPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementDetailPage"),
);

const StaffPage = lazy(
  () => import("@patient-verification/pages/staff/StaffPage"),
);
const StaffFormPage = lazy(
  () => import("@patient-verification/pages/staff/StaffFormPage"),
);
const StaffDetailPage = lazy(
  () => import("@patient-verification/pages/staff/StaffDetailPage"),
);

const ContextPage = lazy(
  () => import("@patient-verification/pages/context/ContextPage"),
);
const ContextFormPage = lazy(
  () => import("@patient-verification/pages/context/ContextFormPage"),
);
const ContextDetailPage = lazy(
  () => import("@patient-verification/pages/context/ContextDetailPage"),
);

const ProcessPage = lazy(
  () => import("@patient-verification/pages/process/ProcessPage"),
);
const ProcessFormPage = lazy(
  () => import("@patient-verification/pages/process/ProcessFormPage"),
);
const ProcessDetailPage = lazy(
  () => import("@patient-verification/pages/process/ProcessDetailPage"),
);

const InstancesPage = lazy(
  () => import("@patient-verification/pages/instances/InstancesPage"),
);

const DashboardPage = lazy(
  () => import("@patient-verification/pages/dashboard/DashboardPage"),
);

export const patientVerificationRoutes: RouteObject = {
  path: "patient-verification",
  element: <IptvSyncWrapper />,
  children: [
    { path: "dashboard", element: <DashboardRouter /> },
    {
      element: (
        <ProtectedRoute requiredRole="admin">
          <Outlet />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "departement",
          children: [
            { index: true, element: <DepartementPage /> },
            { path: "create", element: <DepartementFormPage /> },
            { path: ":departementId", element: <DepartementDetailPage /> },
            { path: ":departementId/edit", element: <DepartementFormPage /> },
          ],
        },
        {
          path: "staff",
          children: [
            { index: true, element: <StaffPage /> },
            { path: "create", element: <StaffFormPage /> },
            { path: ":staffId", element: <StaffDetailPage /> },
            { path: ":staffId/edit", element: <StaffFormPage /> },
          ],
        },
        {
          path: "context",
          children: [
            { index: true, element: <ContextPage /> },
            { path: "create", element: <ContextFormPage /> },
            { path: ":contextId", element: <ContextDetailPage /> },
            { path: ":contextId/edit", element: <ContextFormPage /> },
          ],
        },
        {
          path: "process",
          children: [
            { index: true, element: <ProcessPage /> },
            { path: "create", element: <ProcessFormPage /> },
            { path: ":processId", element: <ProcessDetailPage /> },
            { path: ":processId/edit", element: <ProcessFormPage /> },
          ],
        },
        {
          path: "instances",
          children: [
            { index: true, element: <InstancesPage /> },
            // { path: "create", element: <ProcessFormPage /> },
            // { path: ":processId", element: <ProcessDetailPage /> },
            // { path: ":processId/edit", element: <ProcessFormPage /> },
          ],
        },
      ],
    },
  ],
};
