import { useModuleLogoutStore } from "@/store/useModuleLogoutStore";
import { useModuleKey } from "@/hooks/use-module-key";
import { useBaseLogout } from "./use-base-logout";

export function useBaseGlobalLogout() {
  const currentModule = useModuleKey() || "default"; // "iptv" / "patient-verification"
  const { getHandler } = useModuleLogoutStore();
  const specificLogoutFn = getHandler(currentModule);

  return useBaseLogout({
    logoutFn: specificLogoutFn
      ? async () => {
          await specificLogoutFn();
        }
      : undefined,
    redirectTo: "/",
  });
}
