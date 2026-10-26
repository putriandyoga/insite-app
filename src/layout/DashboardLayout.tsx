import { Outlet, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
  House,
  Menu,
  LogOut,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { sidebarMap } from "@/constants/sidebarMap";
import { headerMap } from "@/constants/headerMap";
import { useUIStore } from "@/store/useUIStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useAutoModuleTheme } from "@/hooks/use-automatic-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import type { SidebarItem } from "@/components/SidebarItem";
import SideMenu from "@/components/SideMenu";
import { useAuthStore } from "@/store/useAuthStore";
import { useBaseGlobalLogout } from "@/hooks/core/use-base-global-logout";
import { useModuleKey } from "@/hooks/use-module-key";

export default function DashboardLayout() {
  useAutoModuleTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();
  const lookupKey = useModuleKey();
  // Panggil hook global logout di sini
  const { logout, loading } = useBaseGlobalLogout();

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
        to: "/",
        icon: <House size={20} />,
      },
    ],
    [],
  );
  // Ambil data sidebar dari map
  const rawSidebar = sidebarMap[lookupKey] ?? [];

  // Jika berupa fungsi (seperti sidebar dinamis role), panggil fungsinya. Jika array, langsung gunakan.
  const moduleSidebar =
    typeof rawSidebar === "function" ? rawSidebar() : rawSidebar;
  // const moduleSidebar = sidebarMap[lookupKey] ?? [];
  const moduleHeader = headerMap[lookupKey] ?? {
    title: "Insite Ciputra Mitra Hospital",
  };

  const dynamicSidebar = [...menuItems, ...moduleSidebar];

  const toggleTheme = () => {
    const isDark = theme === "dark" || theme.endsWith("-dark");
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex h-screen bg-base-200">
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
              <h4 className="heading-h4">{moduleHeader.title}</h4>
              {moduleHeader.subtitle && (
                <p className="text-caption">{moduleHeader.subtitle}</p>
              )}
            </div>
          )}

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

            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-all cursor-pointer"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-primary/20 text-primary flex items-center justify-center shadow-sm">
                  <User size={20} />
                </div>
              </div>

              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-2xl z-50 w-52 p-2 shadow-xl border border-base-200 mt-2"
              >
                {(user?.username || user?.email) && (
                  <li className="menu-title px-3 py-2">
                    <span className="text-caption text-base-content/50 uppercase">
                      Signed in as
                    </span>
                    <span className="text-sm font-semibold text-base-content truncate">
                      {user.username || user.email}
                    </span>
                  </li>
                )}

                <div className="divider my-1 opacity-50" />

                <li>
                  <button
                    onClick={logout}
                    disabled={loading}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-error transition-colors hover:bg-error hover:text-error-content disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </header>
        {/* <main className="flex-1 flex flex-col h-screen overflow-hidden p-4 md:p-6 bg-base-200 relative z-0">
          <Outlet key={location.pathname} />
        </main> */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-base-200 relative z-0">
          <Outlet key={location.pathname} />
        </main>
      </div>
    </div>
  );
}
