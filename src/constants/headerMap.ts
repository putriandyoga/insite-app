export interface HeaderContent {
  title: string;
  subtitle?: string;
}

export const headerMap: Record<string, HeaderContent> = {
  dashboard: {
    title: "Insite",
    subtitle: "All systems in sight.",
  },
  iptv: {
    title: "Insite Ciputra Mitra Hospital",
    subtitle: "Manage your IPTV nurse call stations efficiently",
  },
  "patient-verification": {
    title: "Insite Ciputra Mitra Hospital",
    subtitle: "Real-time patient verification and monitoring",
  },
};
