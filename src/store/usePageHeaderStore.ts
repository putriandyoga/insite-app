import { create } from "zustand";
import type { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export interface StatItem {
  label: string;
  value: string | number;
}

export interface PageHeaderData {
  breadcrumb: BreadcrumbItem[];
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLink?: string;
  actionLabel?: string;
  actionIcon?: LucideIcon;
  stats?: StatItem[];
  back?: string;
}

interface PageHeaderState {
  header: PageHeaderData | null;
  setHeader: (header: PageHeaderData | null) => void;
  clearHeader: () => void;
}

export const usePageHeaderStore = create<PageHeaderState>((set) => ({
  header: null,
  setHeader: (header) => set({ header }),
  clearHeader: () => set({ header: null }),
}));
