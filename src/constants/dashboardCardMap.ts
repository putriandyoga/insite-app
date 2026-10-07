import {
  ClipboardCheck,
  UsersRound,
  AlertTriangle,
  Ticket,
  PartyPopper,
  Box,
  Wrench,
  UserSquare2,
  MonitorCog,
} from "lucide-react";

export const dashboardCards = [
  {
    color: "primary",
    icon: ClipboardCheck,
    title: "Survey",
    description: "Kelola survey dan feedback pengguna.",
    path: "/survey/dashboard",
  },
  {
    color: "bg-teal-500",
    icon: UsersRound,
    title: "Antrean Pasien",
    description: "Pantau dan kelola urutan antrean pasien.",
    path: "/queue/dashboard",
  },
  {
    color: "bg-purple-300",
    icon: MonitorCog,
    title: "Astra",
    description: "Automated Site Testing and Reporting Application.",
    path: "/astra/dashboard",
  },
  {
    color: "error",
    icon: AlertTriangle,
    title: "Incident Report",
    description: "Laporan dan pemantauan insiden.",
    path: "/cases/dashboard",
  },
  {
    color: "accent",
    icon: Ticket,
    title: "Ticketing",
    description: "Kelola dan proses tiket layanan.",
    path: "/ticketing/dashboard",
  },
  {
    color: "bg-pink-300",
    icon: PartyPopper,
    title: "Event",
    description: "Kelola data event dan aktivitas.",
    path: "/event/dashboard",
  },
  {
    color: "bg-rose-300",
    icon: Box,
    title: "Inventory",
    description: "Pantau dan kelola persediaan aset.",
    path: "/inventory",
  },
  {
    color: "secondary",
    icon: Wrench,
    title: "Work Order",
    description: "Atur dan lacak pekerjaan maintenance.",
    path: "/work-order",
  },

  // Client-specific dashboard card
  {
    color: "info",
    icon: UserSquare2,
    title: "Ticketing",
    description: "Ajukan tiket baru dan pantau status laporan Anda.",
    path: "/client/ticketing/dashboard",
  },
];
