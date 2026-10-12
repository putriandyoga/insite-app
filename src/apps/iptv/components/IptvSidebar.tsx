import type { SidebarItem } from "@/components/SidebarItem";
import {
  LayoutDashboard,
  Tv,
  MapPin,
  FileSpreadsheet,
  Cpu,
  Link2,
  RefreshCw,
  Users,
} from "lucide-react";

export const iptvSidebar: SidebarItem[] = [
  {
    label: "Health Check",
    icon: <LayoutDashboard size={20} />,
    children: [
      { label: "Dashboard Health", to: "/app/iptv/health/dashboard" },
      { label: "Device Health", to: "/app/iptv/health/device" },
    ],
  },
  {
    label: "Station List",
    to: "/app/iptv/station", // <-- Harus menggunakan awalan /app/iptv
    icon: <Tv size={20} />,
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
    label: "Perangkat STB",
    to: "/app/iptv/device",
    icon: <Cpu size={20} />,
  },
  {
    label: "Binding STB",
    to: "/app/iptv/binding",
    icon: <Link2 size={20} />,
  },
  {
    label: "Lifecycle Perangkat",
    to: "/app/iptv/lifecycle",
    icon: <RefreshCw size={20} />,
  },
  {
    label: "Import CSV",
    icon: <FileSpreadsheet size={20} />,
    children: [
      { label: "Template Master", to: "/app/iptv/import/template" },
      { label: "Import API", to: "/app/iptv/import/upload" },
    ],
  },
  {
    label: "Manajemen User",
    to: "/app/iptv/user",
    icon: <Users size={20} />,
  },
];
