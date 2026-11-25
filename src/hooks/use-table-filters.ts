import { useDebounce } from "./use-debounce";
import { create } from "zustand";

interface FilterOptions {
  debounceDelay?: number;
  searchKey?: string;
  storeKey?: string;
}

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

type TableStoreHook = ReturnType<typeof createTableStore>;

const storeRegistry = new Map<string, TableStoreHook>();

function getOrCreateTableStore<TFilters extends Record<string, any>>(
  storeKey: string,
  initialFilters: TFilters,
): TableStoreHook {
  const existing = storeRegistry.get(storeKey);
  if (existing) {
    return existing;
  }
  const created = createTableStore(initialFilters);
  storeRegistry.set(storeKey, created);
  return created;
}

export function useTableFilters<TFilters extends Record<string, any>>(
  initialFilters: TFilters,
  options: FilterOptions = {},
) {
  const {
    debounceDelay = 500,
    searchKey = "search",
    storeKey = "default_table",
  } = options;

  const useStore = getOrCreateTableStore(storeKey, initialFilters);
  const { page, search, filters, setPage, setSearch, setFilter, resetTable } =
    useStore();

  const debouncedSearchValue = useDebounce(search, debounceDelay);

  // 1. Gabungkan semua filter dan search
  const rawActiveFilters = {
    ...filters,
    [searchKey]: debouncedSearchValue,
  };

  // 2. Bersihkan otomatis parameter yang kosong, null, atau undefined SEKALI SAJA DI SINI
  const activeFilters = Object.fromEntries(
    Object.entries(rawActiveFilters).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined,
    ),
  );

  return {
    page,
    setPage,
    searchTitle: search,
    debouncedSearch: debouncedSearchValue,
    filters,
    activeFilters, // <-- Ini sudah bersih dari nilai kosong secara otomatis!
    handleFilterChange: setFilter,
    handleSearchChange: setSearch,
    resetFilters: resetTable,
  };
}
