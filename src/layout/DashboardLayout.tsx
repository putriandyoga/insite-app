import { Outlet, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  House,
  Menu,
} from "lucide-react";
import { useMemo } from "react";
import { sidebarMap } from "@/constants/sidebarMap";
import { headerMap } from "@/constants/headerMap";
import { useUIStore } from "@/store/useUIStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useAutoModuleTheme } from "@/hooks/use-automatic-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SidebarItem } from "@/components/Sidebar";
import SideMenu from "@/components/SideMenu";

export default function DashboardLayout() {
  useAutoModuleTheme();
  //   const { handleLogout } = useLogout();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();

  // Menggunakan Zustand untuk state UI (Sidebar & Collapse)
  const {
    collapsed,
    toggleCollapsed,
    sidebarOpen,
    setSidebarOpen,
    toggleSidebarOpen,
  } = useUIStore();

  const menuItems: SidebarItem[] = useMemo<SidebarItem[]>(
    () => [
      {
        label: "Home",
        to: "/dashboard",
        icon: <House size={20} />,
      },
    ],
    [],
  );

  // Parse URL parts secara dinamis untuk lookup modul
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const lookupKey = useMemo(() => {
    if (pathSegments[0] === "client" && pathSegments[1]) {
      return `client-${pathSegments[1]}`;
    }
    return pathSegments[0] || "";
  }, [pathSegments]);

  const moduleSidebar = sidebarMap[lookupKey] ?? [];
  const moduleHeader = headerMap[lookupKey] ?? {
    title: "Insite Ciputra Mitra Hospital",
    // subtitle: "All systems in sight.",
  };

  const dynamicSidebar = [...menuItems, ...moduleSidebar];

  const toggleTheme = () => {
    const isDark = theme === "dark" || theme.endsWith("-dark");
    // const base = theme.endsWith("-dark") ? theme.replace(/-dark$/, "") : theme;

    // Sesuaikan dengan logic tema modul Anda
    setTheme(isDark ? "light" : "dark");
  };
  return (
    <div className="flex h-screen bg-base-200">
      {/* DESKTOP SIDEBAR */}
      {!isMobile && (
        <aside
          className={`${
            collapsed ? "w-16" : "w-64"
          } bg-base-100 border-r border-base-300 flex flex-col transition-all duration-300 shadow-xl relative z-30`}
        >
          <div className="flex items-center justify-center px-4 py-4 border-b border-base-300 h-16">
            <img
              src={collapsed ? "/images/logocrop.ico" : "/images/logo.png"}
              alt="Logo"
              className="h-8 w-auto transition-all duration-300"
            />
          </div>

          <nav className="flex-1 overflow-visible">
            <SideMenu menuItems={dynamicSidebar} collapsed={collapsed} />
          </nav>

          <div className="border-t border-base-300 p-2">
            <button
              onClick={toggleCollapsed}
              className={`btn btn-ghost w-full transition-all duration-300 ${
                collapsed ? "btn-circle mx-auto" : "btn-sm"
              }`}
            >
              {collapsed ? (
                <div
                  className="tooltip tooltip-right"
                  data-tip="Tampilkan Sidebar"
                >
                  <ChevronRight className="size-5 pointer-events-none" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ChevronLeft className="size-5" />
                  <span className="text-sm font-medium">Sembunyikan</span>
                </div>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobile && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <aside
            className={`
              fixed top-0 left-0 h-full w-64
              bg-base-100 border-r border-base-300
              shadow-xl z-50
              transform transition-transform duration-300
              overflow-x-hidden
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}
          >
            <div className="flex items-center px-4 py-4 border-b border-base-300 h-16">
              <img src="/images/logo.png" alt="Logo" className="h-8" />
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden">
              <SideMenu menuItems={dynamicSidebar} collapsed={false} />
            </nav>
          </aside>
        </>
      )}

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="navbar bg-base-100 border-b border-base-300 px-6 h-16">
          <div className="flex flex-1 items-center gap-2">
            {isMobile && (
              <button
                onClick={toggleSidebarOpen}
                className="btn btn-ghost btn-circle hover:scale-105 active:scale-95 transition-transform"
                aria-label="Open Menu"
              >
                <Menu size={20} />
              </button>
            )}
          </div>

          {!isMobile && (
            <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center text-center pointer-events-none">
              <h4 className="font-semibold heading-h4 leading-tight">
                {moduleHeader.title}
              </h4>
              {moduleHeader.subtitle && (
                <p className="text-caption text-base-content/60">
                  {moduleHeader.subtitle}
                </p>
              )}
            </div>
          )}

          {/* TOPBAR ACTIONS & PROFILE DROPDOWN */}
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

            {/* <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-primary/60 flex items-center justify-center text-primary-content shadow-md">
                  <User size={20} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-xl z-1 w-52 p-2 shadow-xl border border-base-300 mt-2"
              >
                <li>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:bg-primary hover:text-primary-content"
                  >
                    <User size={16} />
                    Profile
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error hover:bg-error hover:text-error-content"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </li>
              </ul>
            </div> */}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-200 relative z-0">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}
