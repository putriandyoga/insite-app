import { iptvSidebar } from "@iptv/components/IptvSidebar";
import type { SidebarItem } from "@/components/SidebarItem";
import { patientVerificationSidebar } from "@/apps/patient-verification/components/patientVerificationSidebar";

export const sidebarMap: Record<string, SidebarItem[]> = {
  iptv: iptvSidebar,
  "patient-verification": patientVerificationSidebar,
};
