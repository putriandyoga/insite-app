import { useState, useCallback } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { handleApiError } from "@/utils/errorHandler";

export function useInstanceContextLogs() {
  const [loading, setLoading] = useState(false);
  const [logsData, setLogsData] = useState<any>(null);

  const fetchContextLogs = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      const data = await instancesService.contextLogs(id);
      setLogsData(data);
      return data;
    } catch (err) {
      await handleApiError(err, "Gagal mengambil log perubahan context");
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchContextLogs, logsData, loading };
}
