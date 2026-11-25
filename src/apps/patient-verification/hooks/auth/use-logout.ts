import { useBaseLogout } from "@/hooks/core/use-base-logout";
import { patientAuthService } from "@patient-verification/services/patientVerificationAuthService";

export function usePatientVerificationLogout() {
  return useBaseLogout({
    logoutFn: () => patientAuthService.logout(),
    redirectTo: "/",
  });
}
