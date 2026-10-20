import type { SidebarItem } from "@/components/SidebarItem";
import {
  Users,
  GitBranch,
  FileText,
  CheckSquare,
  DownloadCloud,
} from "lucide-react";

export const patientVerificationSidebar: SidebarItem[] = [
  // 1. Verifikasi (Contoh dengan pengamanan permission di tingkat grup & sub-menu)
  {
    label: "Verifikasi Pasien",
    icon: <CheckSquare size={20} />,
    enablePermission: true, // Mengaktifkan validasi permission untuk menu ini
    permission: "verification.view", // Izin utama untuk melihat menu Verifikasi Pasien
    children: [
      {
        label: "Instance",
        to: "/app/patient-verification/instances",
        permission: "instances.list", // Izin spesifik sub-menu
      },
      {
        label: "Verifikasi Saya",
        to: "/app/patient-verification/instances/my-department",
        permission: "instances.my-department",
      },
    ],
  },

  // 2. Proses Alur Verifikasi (Contoh akses bebas / publik tanpa permission)
  {
    label: "Manajemen Proses",
    icon: <GitBranch size={20} />,
    children: [{ label: "Proses", to: "/app/patient-verification/processes" }],
  },

  // 3. Template Konteks (Contoh diproteksi khusus admin/manager)
  {
    label: "Context Template",
    icon: <FileText size={20} />,
    enablePermission: true,
    permission: "context-templates.manage",
    children: [
      {
        label: "Template",
        to: "/app/patient-verification/context",
      },
    ],
  },

  // 4. Manajemen Staff (Campuran: menu staff umum & sub-menu khusus departemen)
  {
    label: "Master",
    icon: <Users size={20} />,
    children: [
      { label: "Staff", to: "/app/patient-verification/staff" },
      {
        label: "Departemen",
        to: "/app/patient-verification/departement",
      },
      // {
      //   label: "Staff Departemen Saya",
      //   to: "/app/patient-verification/staff/my-department",
      //   enablePermission: true,
      //   permission: "staff.my-department", // Hanya user dengan izin ini yang bisa melihat sub-menu ini
      // },
    ],
  },

  // 6. Laporan & Ekspor (Contoh menu tunggal / tanpa children yang diproteksi)
  {
    label: "Laporan & Ekspor",
    to: "/app/patient-verification/reports",
    icon: <DownloadCloud size={20} />,
    enablePermission: true,
    permission: "reports.export",
  },
];
