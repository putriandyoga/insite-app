import type { SidebarItem } from "@/components/SidebarItem";
import { getCurrentUser } from "@/utils/authHelper";
import { Tv, MapPin, Cpu, Users, MonitorPlay } from "lucide-react";

export const getIptvSidebar = (): SidebarItem[] => {
  // Ambil data user langsung dari localStorage
  const user = getCurrentUser<any>();
  const role = user?.role ? String(user.role).toLowerCase() : "";
  const isAdmin = role === "admin";

  // Daftar semua menu dasar
  const baseItems: SidebarItem[] = [
    {
      label: "Dashboard",
      to: "/app/iptv/dashboard",
      icon: <MonitorPlay size={20} />,
    },
  ];

  // Jika user adalah ADMIN, tambahkan menu-menu manajemen master & user
  if (isAdmin) {
    return [
      ...baseItems,
      {
        label: "Station List",
        to: "/app/iptv/station",
        icon: <Tv size={20} />,
      },
      {
        label: "Perangkat STB",
        to: "/app/iptv/stb",
        icon: <Cpu size={20} />,
      },
      {
        label: "Master Lokasi",
        icon: <MapPin size={20} />,
        children: [
          { label: "Daftar Ward", to: "/app/iptv/ward" },
          { label: "Daftar Room", to: "/app/iptv/room" },
          { label: "Daftar Bed", to: "/app/iptv/bed" },
        ],
      },
      {
        label: "Manajemen User",
        to: "/app/iptv/user",
        icon: <Users size={20} />,
      },
    ];
  }

  // Jika BUKAN ADMIN (misal: perawat/unit), hanya tampilkan Dashboard dan Call Log (atau menu khusus unit)
  return baseItems;
};
