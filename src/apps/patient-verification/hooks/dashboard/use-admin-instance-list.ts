import { useState, useMemo, useCallback } from "react";
import { useInstancesList } from "../instances/use-instances-list";

export function useAdminInstanceList() {
  const {
    data: dataInstance,
    loading: loadingInstance,
    refetch: refetchInstance,
  } = useInstancesList();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    undefined,
  );

  // State untuk filter status: "process" | "completed" | "all" (Default: "process")
  const [statusFilter, setStatusFilter] = useState<string>("process");

  // Filter pencarian dan status data instance pasien
  const filteredData = useMemo(() => {
    if (!dataInstance) return [];

    return dataInstance.filter((item: any) => {
      // 1. Filter Status
      const status = (item.status || "").toLowerCase();
      const isCompleted = status === "completed" || Boolean(item.completed_at);

      if (statusFilter === "process" && isCompleted) return false;
      if (statusFilter === "completed" && !isCompleted) return false;
      // Jika "all", loloskan semua

      // 2. Filter Pencarian (Search Query)
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
