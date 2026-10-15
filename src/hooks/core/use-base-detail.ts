import { useQuery } from "@tanstack/react-query";

interface UseBaseDetailProps<T> {
  id?: string | number;
  queryKey: readonly unknown[];
  fetcher: (id: string) => Promise<T>;
}

export function useBaseDetail<T>({
  id,
  queryKey,
  fetcher,
}: UseBaseDetailProps<T>) {
  const query = useQuery({
    queryKey: [...queryKey, id],
    queryFn: () => fetcher(String(id)),
    enabled: Boolean(id),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}
