import { useEffect } from "react";
import { useModuleLogoutStore } from "@/store/useModuleLogoutStore";

interface ModuleLogoutSyncProps {
  moduleName: string;

  logoutFn: () => Promise<any>;
}

export function ModuleLogoutSync({
  moduleName,
  logoutFn,
}: ModuleLogoutSyncProps) {
  const { register, unregister } = useModuleLogoutStore();

  useEffect(() => {
    register(moduleName, logoutFn as () => Promise<void>);
    return () => {
      unregister(moduleName);
    };
  }, [moduleName, logoutFn, register, unregister]);

  return null;
}
