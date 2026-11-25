import { Outlet } from "react-router-dom";
import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
import { useIptvLogout } from "../hooks/auth/use-logout";

export function IptvSyncWrapper() {
  const { logout } = useIptvLogout();
  return (
    <>
      <ModuleLogoutSync moduleName="iptv" logoutFn={logout} />
      <Outlet />
    </>
  );
}
