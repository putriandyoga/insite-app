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
