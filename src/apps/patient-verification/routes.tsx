import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";

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

export const patientVerificationRoutes: RouteObject = {
  path: "patient-verification",
  element: <IptvSyncWrapper />,
  children: [
    {
      path: "dashboard",
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
