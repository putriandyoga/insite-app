import { Tv, UserCheck } from "lucide-react";

export const dashboardCards = [
  {
    color: "primary",
    icon: Tv,
    title: "IPTV Dashboard",
    description:
      "Kelola siaran, tayangan, dan perangkat IPTV secara real-time.",
    path: "/app/iptv/login",
  },
  {
    color: "secondary",
    icon: UserCheck,
    title: "Patient Verification",
    description: "Verifikasi data identitas dan status kepesertaan pasien.",
    path: "/app/patient-verification/login",
  },

  // Client-specific dashboard card
  // {
  //   color: "info",
  //   icon: UserSquare2,
  //   title: "Ticketing",
  //   description: "Ajukan tiket baru dan pantau status laporan Anda.",
  //   path: "/client/ticketing/dashboard",
  // },
];
