import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
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

const DepartementPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementPage"),
);
const DepartementFormPage = lazy(
  () => import("@patient-verification/pages/departement/DepartementFormPage"),
);

const StaffPage = lazy(
  () => import("@patient-verification/pages/staff/StaffPage"),
);
const StaffFormPage = lazy(
  () => import("@patient-verification/pages/staff/StaffFormPage"),
);

export const patientVerificationRoutes: RouteObject = {
  path: "patient-verification",
  element: <IptvSyncWrapper />,
  children: [
    {
      path: "dashboard",
    },
    {
      path: "departement",
      children: [
        { index: true, element: <DepartementPage /> },
        { path: "create", element: <DepartementFormPage /> },
        { path: ":departementId/edit", element: <DepartementFormPage /> },
      ],
    },
    {
      path: "staff",
      children: [
        { index: true, element: <StaffPage /> },
        { path: "create", element: <StaffFormPage /> },
        { path: ":staffId/edit", element: <StaffFormPage /> },
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
