// hooks/process/use-process-all.ts
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import { processService } from "@patient-verification/services/processService";

export function useProcessAll() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.process?.all
      ? queryKeys.process.all()
      : ["processes", "all"],
    queryFn: async () => {
      const response = await processService.getAll();

      // Ambil bagian data dari respons API (biasanya terbungkus dalam properti .data)
      // Jika struktur API Anda langsung mengembalikan objek { initiable_processes, participating_processes },
      // sesuaikan dengan response?.data || response
      return response?.data ?? response;
    },
  });

  return {
    data: data || { initiable_processes: [], participating_processes: [] },
    loading: isLoading,
    error,
    refetch,
  };
}
