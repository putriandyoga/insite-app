import { matchPath } from "react-router-dom";
import { routePermissionMap } from "./routePermissionMap";

// Cache sederhana untuk performa routing agar tidak melakukan looping berulang
const permissionCache = new Map<string, string | undefined>();

export function getRoutePermission(pathname: string): string | undefined {
  if (permissionCache.has(pathname)) {
    return permissionCache.get(pathname);
  }

  for (const pattern in routePermissionMap) {
    const matched = matchPath({ path: pattern, end: false }, pathname);

    if (matched) {
      const permission = routePermissionMap[pattern];
      permissionCache.set(pathname, permission);
      return permission;
    }
  }

  permissionCache.set(pathname, undefined);
  return undefined;
}
