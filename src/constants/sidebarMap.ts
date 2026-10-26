import { getIptvSidebar } from "@iptv/components/IptvSidebar"; // Ubah jadi fungsi getIptvSidebar jika sebelumnya array statis
import type { SidebarItem } from "@/components/SidebarItem";
import { patientVerificationSidebar } from "@/apps/patient-verification/components/patientVerificationSidebar";

export const sidebarMap: Record<string, SidebarItem[] | (() => SidebarItem[])> =
  {
    iptv: getIptvSidebar, // Daftarkan sebagai fungsi atau array langsung
    "patient-verification": patientVerificationSidebar,
  };
