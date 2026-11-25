import { getIptvSidebar } from "@iptv/components/IptvSidebar"; // Ubah jadi fungsi getIptvSidebar jika sebelumnya array statis
import type { SidebarItem } from "@/components/SidebarItem";
import { getPatientVerificationSidebar } from "@/apps/patient-verification/components/PatientVerificationSidebar";
export const sidebarMap: Record<string, SidebarItem[] | (() => SidebarItem[])> =
  {
    iptv: getIptvSidebar, // Daftarkan sebagai fungsi atau array langsung
    "patient-verification": getPatientVerificationSidebar,
  };
