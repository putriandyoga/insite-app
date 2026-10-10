// src/components/core/ModuleLogoutSync.tsx
import { useEffect } from "react";
import { useModuleLogoutStore } from "@/store/useModuleLogoutStore";

interface ModuleLogoutSyncProps {
  moduleName: string;
  logoutFn: () => Promise<any>; // <-- Ubah dari unknown menjadi any atau void
}

export function ModuleLogoutSync({
  moduleName,
  logoutFn,
}: ModuleLogoutSyncProps) {
  const { register, unregister } = useModuleLogoutStore();

  useEffect(() => {
    register(moduleName, logoutFn);
    return () => {
      unregister(moduleName);
    };
  }, [moduleName, logoutFn, register, unregister]);

  return null;
}
