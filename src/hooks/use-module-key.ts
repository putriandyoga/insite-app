import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useModuleKey() {
  const location = useLocation();

  return useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // Format: /app/iptv/station -> pathSegments[0] = "app", pathSegments[1] = "iptv"
    if (pathSegments[0] === "app") {
      if (pathSegments[1] === "client" && pathSegments[2]) {
        return `client-${pathSegments[2]}`;
      }
      return pathSegments[1] || "";
    }

    // Format lama atau non-app: /client/name/...
    if (pathSegments[0] === "client" && pathSegments[1]) {
      return `client-${pathSegments[1]}`;
    }

    return pathSegments[0] || "";
  }, [location.pathname]);
}
