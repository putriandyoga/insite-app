import { Outlet, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { headerMap } from "@/constants/headerMap";
import { useThemeStore } from "@/store/useThemeStore";
import { useAutoModuleTheme } from "@/hooks/use-automatic-theme";
import { useModuleKey } from "@/hooks/use-module-key";

export default function PortalLayout() {
  useAutoModuleTheme();
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const lookupKey = useModuleKey();

  const moduleHeader = headerMap[lookupKey] ?? {
    title: "Insite Ciputra Mitra Hospital",
    // subtitle: "Portal Layanan Terpadu",
  };

  const toggleTheme = () => {
    const isDark = theme === "dark" || theme.endsWith("-dark");
    setTheme(isDark ? "light" : "dark");
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col h-screen bg-base-200">
      {/* HEADER NAVBAR */}
      <header className="navbar bg-base-100 border-b border-base-300 px-6 h-16 shrink-0 relative z-30">
        <div className="flex flex-1 items-center gap-2">
          {/* Logo tetap menggunakan logo utama di semua ukuran layar */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Judul Header Tengah (Hidden saat mobile, tampil di sm ke atas) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex-col items-center text-center pointer-events-none hidden sm:flex">
          <h4 className="font-semibold heading-h4 leading-tight">
            {moduleHeader.title}
          </h4>
          {moduleHeader.subtitle && (
            <p className="text-caption text-base-content/60">
              {moduleHeader.subtitle}
            </p>
          )}
        </div>

        {/* TOPBAR ACTIONS (Theme Toggle) */}
        <div className="flex flex-none gap-2 items-center">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle hover:bg-base-200"
            aria-label="Toggle Theme"
          >
            {theme === "dark" || theme.endsWith("-dark") ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-200 relative z-0">
        <Outlet key={location.pathname} />
      </main>

      {/* FOOTER PORTAL */}
      <footer className="bg-base-100 border-t border-base-300 shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-base-content/60">
          <span>
            &copy; {currentYear} Ciputra Mitra Hospital Banjarmasin. All rights
            reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
