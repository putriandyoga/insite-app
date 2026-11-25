import { useState, useEffect, useCallback } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { handleApiError } from "@/utils/errorHandler";

import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";

export function useAdminInstanceDetail(
  selectedId: string | number | undefined,
  onRefreshList: () => void,
) {
  const [selectedInstance, setSelectedInstance] = useState<any>(null);
  const [instanceDetail, setInstanceDetail] = useState<any>(null);
  const [contextLogs, setContextLogs] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [cancelling, setCancelling] = useState(false);
  const [updatingContext, setUpdatingContext] = useState(false);

  // Pasangkan activeTab dengan selectedId agar otomatis reset ke "audit" tiap ganti pasien
  const [tabState, setTabState] = useState<{
    forId: string | number | undefined;
    tab: "audit" | "logs";
  }>({
    forId: selectedId,
    tab: "audit",
  });

  const activeTab: "audit" | "logs" =
    tabState.forId === selectedId ? tabState.tab : "audit";

  const setActiveTab = useCallback(
    (tab: "audit" | "logs") => {
      setTabState({ forId: selectedId, tab });
    },
    [selectedId],
  );

  const fetchDetail = useCallback(async (id: string | number) => {
    try {
      setLoadingDetail(true);

      const [historyData, logsData, detailData] = await Promise.all([
        instancesService.history(id),
        instancesService.contextLogs(id),
        instancesService.getDetail(id),
      ]);

      setSelectedInstance(historyData);
      setContextLogs(Array.isArray(logsData) ? logsData : []);
      setInstanceDetail(detailData);
    } catch (err) {
      await handleApiError(
        err,
        "Gagal memuat detail dan history instance pasien",
      );
      setSelectedInstance(null);
      setContextLogs([]);
      setInstanceDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;

    Promise.all([
      instancesService.history(selectedId),
      instancesService.contextLogs(selectedId),
      instancesService.getDetail(selectedId),
    ])
      .then(([historyData, logsData, detailData]) => {
        if (cancelled) return;
        setSelectedInstance(historyData);
        setContextLogs(Array.isArray(logsData) ? logsData : []);
        setInstanceDetail(detailData);
      })
      .catch(async (err) => {
        if (cancelled) return;
        await handleApiError(
          err,
          "Gagal memuat detail dan history instance pasien",
        );
        if (cancelled) return;
        setSelectedInstance(null);
        setContextLogs([]);
        setInstanceDetail(null);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const handleCancelInstance = async () => {
    if (!selectedId) return;

    const reason = await showAlert({
      title: "Batalkan Instance Verifikasi",
      text: "Masukkan alasan pembatalan instance ini:",
      input: "text",
      inputPlaceholder: "Contoh: Pasien batal pulang, kondisi memburuk...",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Batalkan",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value || !value.trim()) return "Alasan pembatalan wajib diisi!";
      },
    });

    if (typeof reason !== "string" || !reason.trim()) return;

    try {
      setCancelling(true);
      await instancesService.cancel(selectedId, { reason: reason.trim() });

      await showAlert({
        title: "Berhasil!",
        text: "Instance berhasil dibatalkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchDetail(selectedId);
      onRefreshList();
    } catch (err) {
      await handleApiError(err, "Gagal membatalkan instance");
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdateContext = async (
    contextData: Record<string, any>,
    changeReason: string,
    onSuccessModal: () => void,
  ) => {
    if (!selectedId) return;
    try {
      setUpdatingContext(true);
      await instancesService.updateContext(selectedId, {
        context_data: contextData,
        change_reason: changeReason,
      });

      await showAlert({
        title: "Berhasil!",
        text: "Context data berhasil diperbarui.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      onSuccessModal();
      await fetchDetail(selectedId);
      onRefreshList();
    } catch (err) {
      await handleApiError(err, "Gagal memperbarui context data");
    } finally {
      setUpdatingContext(false);
    }
  };

  return {
    selectedInstance: selectedId ? selectedInstance : null,
    instanceDetail: selectedId ? instanceDetail : null,
    contextLogs: selectedId ? contextLogs : [],
    loadingDetail: selectedId ? loadingDetail : false,
    cancelling,
    updatingContext,
    activeTab,
    setActiveTab,
    handleCancelInstance,
    handleUpdateContext,
    refetchDetail: () =>
      selectedId ? fetchDetail(selectedId) : Promise.resolve(),
  };
}
