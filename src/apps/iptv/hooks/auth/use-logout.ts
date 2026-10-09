import { useBaseLogout } from "@/hooks/core/use-base-logout";
import { iptvAuthService } from "@iptv/services/iptvAuthService";

export function useLogout() {
  return useBaseLogout({
    logoutFn: () => iptvAuthService.logout(),
    redirectTo: "/",
  });
}
