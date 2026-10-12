import { useEffect } from "react";
import { useModuleLogoutStore } from "@/store/useModuleLogoutStore";

interface ModuleLogoutSyncProps {
  moduleName: string;
  // Ubah Promise<unknown> menjadi Promise<any> atau gunakan void | Promise<any>
  logoutFn: () => Promise<any>;
}

export function ModuleLogoutSync({
  moduleName,
  logoutFn,
}: ModuleLogoutSyncProps) {
  const { register, unregister } = useModuleLogoutStore();

  useEffect(() => {
    // Lakukan cast ke ( ) => Promise<void> jika store mewajibkan tipe void
    register(moduleName, logoutFn as () => Promise<void>);
    return () => {
      unregister(moduleName);
    };
  }, [moduleName, logoutFn, register, unregister]);

  return null;
}
