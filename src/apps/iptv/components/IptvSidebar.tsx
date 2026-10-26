import type { SidebarItem } from "@/components/SidebarItem";
import {
  Tv,
  MapPin,
  Cpu,
  Users,
  MonitorPlay,
  PhoneCallIcon,
} from "lucide-react";

export const iptvSidebar: SidebarItem[] = [
  {
    label: "Dashboard",
    to: "/app/iptv/dashboard",
    icon: <MonitorPlay size={20} />,
  },
  {
    label: "Station List",
    to: "/app/iptv/station",
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
    to: "/app/iptv/stb",
    icon: <Cpu size={20} />,
  },
  {
    label: "Call Log",
    icon: <PhoneCallIcon size={20} />,
    to: "/app/iptv/call",
    // children: [{ label: "Call", to: "/app/iptv/call" }],
  },
  // {
  //   label: "Panel & Call",
  //   icon: <PhoneCallIcon size={20} />,
  //   children: [{ label: "Call", to: "/app/iptv/call" }],
  // },
  {
    label: "Manajemen User",
    to: "/app/iptv/user",
    icon: <Users size={20} />,
  },
];
