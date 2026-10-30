import { useState, useMemo, useCallback } from "react";
import { useInstancesAll } from "@patient-verification/hooks/instances/use-instances-all";

export function useAdminInstanceList() {
  const {
    data: dataInstance,
    loading: loadingInstance,
    refetch: refetchInstance,
  } = useInstancesAll();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    undefined,
  );

  const [statusFilter, setStatusFilter] = useState<string>("process");

  const filteredData = useMemo(() => {
    if (!dataInstance) return [];

    return dataInstance.filter((item: any) => {
      const status = (item.status || "").toLowerCase();
      const isCompleted = status === "completed" || Boolean(item.completed_at);

      if (statusFilter === "process" && isCompleted) return false;
      if (statusFilter === "completed" && !isCompleted) return false;

      const query = searchQuery.toLowerCase();
      const name = (
        item.context_data?.name ||
        item.ticket_code ||
        ""
      ).toLowerCase();
      const rm = (item.context_data?.medical_record || "").toLowerCase();

      return name.includes(query) || rm.includes(query);
    });
  }, [dataInstance, searchQuery, statusFilter]);

  const handleSelectInstance = useCallback((id: string | number) => {
    setSelectedId(id);
  }, []);

  return {
    dataInstance,
    loadingInstance,
    refetchInstance,
    searchQuery,
    setSearchQuery,
    selectedId,
    setSelectedId,
    statusFilter,
    setStatusFilter,
    filteredData,
    handleSelectInstance,
  };
}
