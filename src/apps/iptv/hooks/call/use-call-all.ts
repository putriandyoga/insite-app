import { callService } from "@iptv/services/callService";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";

export function useCallAll(filters: Record<string, any> = {}) {
  const query = useQuery({
    queryKey: [...queryKeys.call.list(filters), "all-export"],
    queryFn: () => callService.getAll(filters), // Pastikan service getAll mendukung parameter
    enabled: false, // Hanya dijalankan manual saat tombol export diklik
  });

  return {
    fetchAll: query.refetch,
    loading: query.isLoading,
  };
}
