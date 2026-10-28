import type { SidebarItem } from "@/components/SidebarItem";
import { getCurrentUser } from "@/utils/authHelper";
import {
  Users,
  DownloadCloud,
  FileText,
  GitBranch,
  CheckSquare,
  ListCheck,
} from "lucide-react";

export const getPatientVerificationSidebar = (): SidebarItem[] => {
  const user = getCurrentUser<any>();
  const role = user?.role ? String(user.role).toLowerCase() : "";
  const isAdmin = role === "admin";

  const baseItems: SidebarItem[] = [
    {
      label: "Dashboard",
      to: "/app/patient-verification/dashboard",
      icon: <ListCheck size={20} />,
    },
  ];

  if (isAdmin) {
    return [
      ...baseItems,
      {
        label: "Verifikasi Pasien",
        icon: <CheckSquare size={20} />,
        enablePermission: true,
        permission: "verification.view",
        children: [
          {
            label: "Instance",
            to: "/app/patient-verification/instances",
            permission: "instances.list",
          },
          {
            label: "Verifikasi Saya",
            to: "/app/patient-verification/instances/my-department",
            permission: "instances.my-department",
          },
        ],
      },

      {
        label: "Manajemen Proses",
        icon: <GitBranch size={20} />,
        children: [
          { label: "Proses", to: "/app/patient-verification/process" },
        ],
      },

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

      {
        label: "Master",
        icon: <Users size={20} />,
        children: [
          { label: "Staff", to: "/app/patient-verification/staff" },
          {
            label: "Departemen",
            to: "/app/patient-verification/departement",
          },
        ],
      },
      {
        label: "Laporan & Ekspor",
        to: "/app/patient-verification/reports",
        icon: <DownloadCloud size={20} />,
        enablePermission: true,
        permission: "reports.export",
      },
    ];
  }

  return baseItems;
};
