// src/core/use-base-all.ts
import { useQuery } from "@tanstack/react-query";

interface UseBaseAllProps<T> {
  queryKey: readonly unknown[];
  fetcher: () => Promise<T[]>;
  enabled?: boolean;
}

export function useBaseAll<T>({
  queryKey,
  fetcher,
  enabled = true,
}: UseBaseAllProps<T>) {
  const query = useQuery({
    queryKey,
    queryFn: fetcher,
    enabled,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}
