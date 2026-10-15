import type { PaginationResult } from "@/types/common";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

interface UseBaseListProps<T, P extends Record<string, any>> {
  queryKey: readonly unknown[];
  fetcher: (params: P) => Promise<PaginationResult<T>>;
  params: P;
  enabled?: boolean;
}

export function useBaseList<T, P extends Record<string, any>>({
  queryKey,
  fetcher,
  params,
  enabled = true,
}: UseBaseListProps<T, P>) {
  const query = useQuery({
    queryKey: [...queryKey, params],
    queryFn: () => fetcher(params),
    enabled,
    placeholderData: keepPreviousData,
  });

  return {
    data: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    lastPage: query.data?.lastPage ?? 1,
    perPage: query.data?.perPage ?? 10,
    page: query.data?.currentPage ?? params.page ?? 1,
    loading: query.isLoading,
    isFetching: query.isFetching,
    error: query.isError,
    refetch: query.refetch,
  };
}
