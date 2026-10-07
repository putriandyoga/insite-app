export interface HeaderContent {
  title: string;
  subtitle?: string;
}

export const headerMap: Record<string, HeaderContent> = {
  dashboard: {
    title: "Ciputra Mitra Hospital Nexus",
    subtitle: "Connecting all internal systems",
  },
  inventory: {
    title: "Inventory Module",
    subtitle: "Manage your stock efficiently",
  },
  cases: {
    title: "Incident Management System",
    subtitle: "Real-time monitoring and reporting",
  },
  event: {
    title: "Event Management",
    subtitle: "Manage all your events effortlessly",
  },
  ticketing: {
    title: "Ticketing System",
    subtitle: "Create, track, and manage requests efficiently",
  },
  survey: {
    title: "Survey Dashboard",
    subtitle: "Manage categories, questions, and analyze survey results",
  },
  queue: {
    title: "Queue Management",
    subtitle: "Manage and prioritize tasks effectively",
  },
  astra: {
    title: "A S T R A",
    subtitle: "Automated Site Testing and Reporting Application.",
  },
};
