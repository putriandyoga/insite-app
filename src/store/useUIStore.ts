import { create } from "zustand";

interface UIState {
  collapsed: boolean;
  toggleCollapsed: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarOpen: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  collapsed: true,
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarOpen: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
