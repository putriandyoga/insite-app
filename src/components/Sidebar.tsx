import { ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";

export interface SidebarItem {
  label: string;
  to?: string;
  icon?: React.ReactNode;
  children?: SidebarItem[];
  external?: boolean;
  href?: string;
  permission?: string;
  hasAccess?: boolean;
}

export interface OpenMenusState {
  [key: string]: boolean;
}

export interface SidebarItemProps {
  item: SidebarItem;
  level?: number;
  parentKey?: string;
  collapsed: boolean;
  isPathActive: (item: SidebarItem) => boolean;
  openMenus: OpenMenusState;
  toggleMenu: (key: string) => void;
}

const SidebarItemComponent = ({
  item,
  level = 0,
  parentKey = "",
  collapsed,
  isPathActive,
  openMenus,
  toggleMenu,
}: SidebarItemProps) => {
  const itemKey = `${parentKey}-${item.label}`;
  const hasChildren = item.children && item.children.length > 0;

  // Jika tidak punya akses dan bukan parent yang punya anak, langsung return null
  if (!item.hasAccess && !hasChildren) return null;

  const active = isPathActive(item);
  const isOpen = openMenus[itemKey] || active;
  const paddingLeft = level > 0 ? `${level * 1 + 0.75}rem` : undefined;

  // 1. RENDER UNTUK ITEM YANG MEMILIKI CHILDREN (DROPDOWN)
  if (hasChildren) {
    return (
      <li key={itemKey} className="relative group">
        <div
          onClick={() => !collapsed && toggleMenu(itemKey)}
          style={{ paddingLeft }}
          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
            active
              ? "bg-primary/40 text-primary-content font-semibold shadow-sm"
              : "hover:bg-base-300/70 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            {level === 0 && item.icon && item.icon}
            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>

          {!collapsed && (
            <ChevronDown
              className={`size-4 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>

        <div className="absolute inset-y-0 left-full w-3"></div>

        {/* Dropdown Popover saat Sidebar Collapsed */}
        {collapsed && level === 0 && (
          <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50 animate-in fade-in slide-in-from-left-2 duration-200">
            <div className="bg-base-100 rounded-lg shadow-xl border border-base-300 py-2 min-w-50 max-h-100 overflow-y-auto">
              <div className="px-4 py-2 border-b border-base-300">
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              <ul className="py-1">
                {item.children!.map((child) => (
                  <li key={`${itemKey}-${child.label}`} className="pr-4">
                    <NavLink
                      to={child.to!}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-content font-semibold"
                            : "hover:bg-base-200"
                        }`
                      }
                    >
                      <span className="text-sm">{child.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Sub-menu saat Sidebar Expanded */}
        {!collapsed && isOpen && (
          <ul className="ml-2 mt-1 space-y-1 animate-in slide-in-from-top-2 duration-300">
            {item
              .children!.filter((child) => child.hasAccess)
              .map((child) => (
                <SidebarItemComponent
                  key={`${itemKey}-${child.label}`}
                  item={child}
                  level={level + 1}
                  parentKey={itemKey}
                  collapsed={collapsed}
                  isPathActive={isPathActive}
                  openMenus={openMenus}
                  toggleMenu={toggleMenu}
                />
              ))}
          </ul>
        )}
      </li>
    );
  }

  // 2. RENDER UNTUK EXTERNAL LINK
  if (item.external && item.hasAccess) {
    return (
      <li key={itemKey}>
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ paddingLeft }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-base-300/70 hover:shadow-sm group"
        >
          {level === 0 && item.icon && item.icon}
          {!collapsed && (
            <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">
              {item.label}
            </span>
          )}
        </a>
      </li>
    );
  }

  // 3. RENDER UNTUK INTERNAL ROUTE (NAVLINK) BIASA
  if (item.hasAccess && item.to) {
    return (
      <li key={itemKey}>
        <NavLink
          to={item.to}
          style={{ paddingLeft }}
          className={({ isActive }) =>
            `relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
              isActive
                ? "bg-primary/60 text-primary-content font-semibold shadow-sm"
                : "hover:bg-base-300/70 hover:shadow-sm"
            }`
          }
        >
          <div className="flex items-center gap-3 relative">
            {level === 0 && item.icon && (
              <div className="relative flex items-center">
                {item.icon}

                {/* Tooltip saat collapsed */}
                {collapsed && (
                  <div
                    className="
                      absolute left-full ml-8
                      opacity-0 scale-95
                      group-hover:opacity-100 group-hover:scale-100
                      transition-all duration-200
                      pointer-events-none
                      z-50
                    "
                  >
                    <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl px-3 py-1.5">
                      <span className="text-sm font-medium whitespace-nowrap text-base-content">
                        {item.label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!collapsed && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </div>
        </NavLink>
      </li>
    );
  }

  return null;
};

export default SidebarItemComponent;
