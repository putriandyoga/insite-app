import { iptvAuthService } from "@iptv/services/iptvAuthService";
import { useBaseLogin } from "@/hooks/core/use-base-login";

export function useLogin() {
  return useBaseLogin({
    loginFn: (payload: { username: string; password: string }) =>
      iptvAuthService.login(payload),
    transformUser: (result) => ({
      id: result.user.id,
      email: `${result.user.username}`,
      token: "COOKIE_SESSION_ACTIVE",
      role: result.user.role,
      permissions: [],
    }),
    redirectTo: "/app/iptv/dashboard",
  });
}
