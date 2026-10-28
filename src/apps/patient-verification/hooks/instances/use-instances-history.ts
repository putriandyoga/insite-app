import { useState, useCallback } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { handleApiError } from "@/utils/errorHandler";
import type { InstancesItem } from "@patient-verification/types/instancesTypes";

export function useInstanceHistory() {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<InstancesItem | null>(null);

  const fetchHistory = useCallback(async (id: string | number) => {
    try {
      setLoading(true);
      const data = await instancesService.history(id);
      setHistoryData(data);
      return data;
    } catch (err) {
      await handleApiError(err, "Gagal mengambil audit trail history");
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchHistory, historyData, loading };
}
