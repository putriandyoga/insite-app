// C:\Project\Production\insite-react\src\hooks\core\useGlobalLogout.ts
import { useLocation } from "react-router-dom";
import { useModuleLogoutStore } from "@/store/useModuleLogoutStore";
import { useBaseLogout } from "./use-base-logout";

export function useBaseGlobalLogout() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentModule = pathSegments[0] || "default";

  const { getHandler } = useModuleLogoutStore();
  const specificLogoutFn = getHandler(currentModule);

  // Jika modul punya logout khusus (misal iptv), jalankan itu. Jika tidak, jalankan base logout biasa.
  return useBaseLogout({
    logoutFn: specificLogoutFn
      ? async () => {
          await specificLogoutFn();
        }
      : undefined,
    redirectTo: "/",
  });
}
