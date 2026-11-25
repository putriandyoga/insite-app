import { Outlet } from "react-router-dom";
import { ModuleLogoutSync } from "@/components/ModuleLogoutSync";
import { usePatientVerificationLogout } from "../hooks/auth/use-logout";

export function PatientVerificationSyncWrapper() {
  const { logout } = usePatientVerificationLogout();
  return (
    <>
      <ModuleLogoutSync moduleName="patient-verification" logoutFn={logout} />
      <Outlet />
    </>
  );
}
