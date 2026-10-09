// src/stores/createTableStore.ts
import { create } from "zustand";

interface TableState<TFilters> {
  page: number;
  search: string;
  filters: TFilters;

  // Actions
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  setFilter: <K extends keyof TFilters>(field: K, value: TFilters[K]) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  resetTable: () => void;
}

export function createTableStore<TFilters extends Record<string, any>>(
  initialFilters: TFilters,
) {
  return create<TableState<TFilters>>((set) => ({
    page: 1,
    search: "",
    filters: initialFilters,

    setPage: (page) => set({ page }),

    setSearch: (search) => set({ search, page: 1 }), // Reset ke page 1 saat search berubah

    setFilter: (field, value) =>
      set((state) => ({
        filters: { ...state.filters, [field]: value },
        page: 1, // Reset ke page 1 saat filter berubah
      })),

    setFilters: (newFilters) =>
      set((state) => ({
        filters: { ...state.filters, ...newFilters },
        page: 1,
      })),

    resetTable: () =>
      set({
        page: 1,
        search: "",
        filters: initialFilters,
      }),
  }));
}
