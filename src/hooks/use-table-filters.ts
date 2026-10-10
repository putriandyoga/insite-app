// src/hooks/use-table-filters.ts
import { useDebounce } from "./use-debounce";
import { create } from "zustand";

interface FilterOptions {
  debounceDelay?: number;
  searchKey?: string;
  storeKey?: string; // Kunci unik untuk store jika diperlukan per halaman
}

// Factory Zustand Store yang independen per instance/halaman
const createTableStore = <TFilters extends Record<string, any>>(
  initialFilters: TFilters,
) => {
  return create<{
    page: number;
    search: string;
    filters: TFilters;
    setPage: (p: number) => void;
    setSearch: (s: string) => void;
    setFilter: <K extends keyof TFilters>(field: K, value: TFilters[K]) => void;
    resetTable: () => void;
  }>((set) => ({
    page: 1,
    search: "",
    filters: initialFilters,
    setPage: (page) => set({ page }),
    setSearch: (search) => set({ search, page: 1 }),
    setFilter: (field, value) =>
      set((state) => ({
        filters: { ...state.filters, [field]: value },
        page: 1,
      })),
    resetTable: () => set({ page: 1, search: "", filters: initialFilters }),
  }));
};

// Cache store sederhana agar state tidak hilang saat komponen unmount/mount kembali (navigasi detail)
const storeRegistry: Record<string, ReturnType<typeof createTableStore>> = {};

export function useTableFilters<TFilters extends Record<string, any>>(
  initialFilters: TFilters,
  options: FilterOptions = {},
) {
  const {
    debounceDelay = 500,
    searchKey = "search",
    storeKey = "default_table",
  } = options;

  // Inisialisasi atau ambil store yang sudah ada berdasarkan storeKey agar state tersimpan saat kembali dari detail
  if (!storeRegistry[storeKey]) {
    storeRegistry[storeKey] = createTableStore(initialFilters);
  }

  const useStore = storeRegistry[storeKey];
  const { page, search, filters, setPage, setSearch, setFilter, resetTable } =
    useStore();

  // Debounce untuk keyword pencarian
  const debouncedSearchValue = useDebounce(search, debounceDelay);

  const activeFilters = {
    ...filters,
    [searchKey]: debouncedSearchValue,
  };

  return {
    page,
    setPage,
    searchTitle: search,
    debouncedSearch: debouncedSearchValue,
    filters,
    activeFilters,
    handleFilterChange: setFilter,
    handleSearchChange: setSearch,
    resetFilters: resetTable,
  };
}
