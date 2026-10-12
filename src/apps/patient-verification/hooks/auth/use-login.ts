import { useBaseLogin } from "@/hooks/core/use-base-login";
import { patientAuthService } from "@patient-verification/services/patientVerificationAuthService";

export function useLogin() {
  return useBaseLogin({
    loginFn: (payload: { username: string; password: string }) =>
      patientAuthService.login(payload),

    transformUser: (result) => ({
      id: result.user.id.toString(),
      username: result.user.username,
      email:
        result.user.email !== "null" && result.user.email
          ? result.user.email
          : `${result.user.username}@hospital.local`,
      token: result.token,
      role: result.user.role,
      permissions: [],
      departemen_id: result.user.departemen_id,
    }),

    redirectTo: "/app/patient-verification/instances",
  });
}
