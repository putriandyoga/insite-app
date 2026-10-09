// src/hooks/use-table-filters.ts
import { useDebounce } from "./use-debounce";

interface FilterOptions {
  debounceDelay?: number;
  searchKey?: string;
}

export function useTableFilters<TFilters extends Record<string, any>>(
  store: {
    page: number;
    search: string;
    filters: TFilters;
    setPage: (p: number) => void;
    setSearch: (s: string) => void;
    setFilter: (field: any, val: any) => void;
    resetTable: () => void;
  },
  options: FilterOptions = {},
) {
  const { debounceDelay = 500, searchKey = "search" } = options;

  const { page, search, filters, setPage, setSearch, setFilter, resetTable } =
    store;

  // Debounce khusus untuk keyword pencarian
  const debouncedSearchValue = useDebounce(search, debounceDelay);

  // Active filters yang nantinya dilempar ke React Query / API
  const activeFilters = {
    ...filters,
    [searchKey]: debouncedSearchValue,
  };

  return {
    page,
    setPage,
    searchTitle: search,
    filters,
    activeFilters,
    handleFilterChange: setFilter,
    handleSearchChange: setSearch,
    resetFilters: resetTable,
  };
}
