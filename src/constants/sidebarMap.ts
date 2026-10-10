import { iptvSidebar } from "@/apps/iptv/components/IptvSidebar";
import type { SidebarItem } from "@/components/Sidebar";
// import { casesSidebar } from "@/apps/cases/components/IncidentSidebar";
// import { eventSidebar } from "@/apps/event/components/EventSidebar";
// import { surveySidebar } from "@survey/components/SurveySidebar";
// import { ticketingSidebar } from "@/apps/ticketing/components/admin/TicketingSidebar";
// import { queueSidebar } from "@/apps/queue/components/QueueSidebar";
// import { clientTicketingSidebar } from "@/apps/ticketing/components/client/ClientTicketingSidebar";

export const sidebarMap: Record<string, SidebarItem[]> = {
  "app/iptv": iptvSidebar,
  iptv: iptvSidebar,
  // cases: casesSidebar,
  // event: eventSidebar,
  // ticketing: ticketingSidebar,
  // survey: surveySidebar,
  // queue: queueSidebar,
  // "client-ticketing": clientTicketingSidebar,
};
