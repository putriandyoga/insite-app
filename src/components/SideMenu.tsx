import { useLocation } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import SidebarItemComponent, {
  type SidebarItem,
  type OpenMenusState,
} from "./SidebarItem";
import { useAuthStore } from "@/store/useAuthStore";
import { hasPermission } from "@/utils/hasPermission";
import { ENABLE_SIDEBAR_PERMISSION } from "@/config/featureFlags"; // <-- Import flag

interface SideMenuProps {
  menuItems: SidebarItem[];
  collapsed: boolean;
}

export default function SideMenu({ menuItems, collapsed }: SideMenuProps) {
  const { user } = useAuthStore();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<OpenMenusState>({});

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) => {
      const isRootMenu = key.split("-").length === 2;

      if (isRootMenu) {
        const newState: OpenMenusState = {};

        Object.keys(prev).forEach((k) => {
          if (k.split("-").length !== 2) {
            newState[k] = prev[k];
          }
        });
        newState[key] = !prev[key];
        return newState;
      }

      return {
        ...prev,
        [key]: !prev[key],
      };
    });
  };

  useEffect(() => {
    if (collapsed) setOpenMenus({});
  }, [collapsed]);

  const isPathActive = (item: SidebarItem): boolean => {
    if (item.to && location.pathname.startsWith(item.to)) return true;
    if (item.children) {
      return item.children.some((child) => isPathActive(child));
    }
    return false;
  };

  // Filter menu yang fleksibel berdasarkan feature flag
  const filteredMenuItems = useMemo(() => {
    // Jika fitur permission NONAKTIF, berikan akses penuh ke semua menu
    if (!ENABLE_SIDEBAR_PERMISSION) {
      const grantAllAccess = (items: SidebarItem[]): SidebarItem[] =>
        items.map((item) => ({
          ...item,
          hasAccess: true,
          children: item.children ? grantAllAccess(item.children) : undefined,
        }));
      return grantAllAccess(menuItems);
    }

    // Jika fitur permission AKTIF, jalankan logika penyaringan aslinya
    if (!user) return menuItems.filter((item) => !item.permission);

    const filterMenu = (items: SidebarItem[]): SidebarItem[] => {
      return items
        .map((item) => {
          const children = item.children
            ? filterMenu(item.children)
            : undefined;

          const canAccessParent =
            !item.permission || hasPermission(user, item.permission);

          if (!canAccessParent && (!children || children.length === 0)) {
            return null;
          }

          return { ...item, children, hasAccess: canAccessParent };
        })
        .filter(Boolean) as SidebarItem[];
    };

    return filterMenu(menuItems);
  }, [menuItems, user]);

  return (
    <ul className="menu w-full p-3 gap-1.5">
      {filteredMenuItems.map((item) => (
        <SidebarItemComponent
          key={item.label}
          item={item}
          collapsed={collapsed}
          isPathActive={isPathActive}
          openMenus={openMenus}
          toggleMenu={toggleMenu}
        />
      ))}
    </ul>
  );
}
