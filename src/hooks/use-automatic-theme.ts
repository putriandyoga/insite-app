import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { APP_THEME_MAP } from "@/config/appThemes";
import { useThemeStore } from "@/store/useThemeStore";

export function useAutoModuleTheme() {
  const location = useLocation();
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const currentTheme = useThemeStore.getState().theme;
    // Ambil segmen path pertama, misal "/event/detail" jadi "event"
    const pathSegment = "/" + location.pathname.split("/").filter(Boolean)[0];
    const targetModuleTheme = APP_THEME_MAP[pathSegment];

    if (targetModuleTheme) {
      // Jika rute ini terdaftar di MAP, gunakan tema modul tersebut
      const isDark = currentTheme.endsWith("-dark");
      const newTheme = isDark ? `${targetModuleTheme}-dark` : targetModuleTheme;
      if (currentTheme !== newTheme) {
        setTheme(newTheme);
      }
    } else {
      // Jika kembali ke Home/Dashboard utama, kembalikan ke default (light/dark)
      if (
        Object.values(APP_THEME_MAP).some((t) => currentTheme.startsWith(t))
      ) {
        setTheme("light");
      }
    }
  }, [location.pathname, setTheme]);
}
