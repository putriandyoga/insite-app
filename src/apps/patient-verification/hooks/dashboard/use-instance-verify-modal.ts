// hooks/instances/use-instance-first-verify-modal.ts
import { useState, useMemo } from "react";
import { useProcessAll } from "@patient-verification/hooks/process/use-process-all";
import { useInstanceVerifyFirst } from "@patient-verification/hooks/instances/use-instances-verify-first";

export function useInstanceVerifyModal(onSuccess: () => void) {
  const { data: dataProcess, loading: loadingProcess } = useProcessAll();

  const [isFirstVerifyModalOpen, setIsFirstVerifyModalOpen] = useState(false);
  const [firstVerifyProcessId, setFirstVerifyProcessId] = useState<
    string | number
  >("");
  const [firstVerifyStaffId, setFirstVerifyStaffId] = useState<string | number>(
    "",
  );
  const [firstVerifyNotes, setFirstVerifyNotes] = useState("");
  const [contextData, setContextData] = useState<Record<string, string>>({});

  // Hook Verifikasi Pertama
  const { verifyFirst, loading: loadingFirstVerify } = useInstanceVerifyFirst(
    () => {
      setIsFirstVerifyModalOpen(false);
      setFirstVerifyNotes("");
      setFirstVerifyStaffId("");
      setFirstVerifyProcessId("");
      setContextData({});
      onSuccess();
    },
  );

  // Cari data proses yang sedang dipilih di dropdown
  const selectedProcessObj = useMemo(() => {
    if (!dataProcess?.initiable_processes) return null;
    return dataProcess.initiable_processes.find(
      (item: any) => String(item.id) === String(firstVerifyProcessId),
    );
  }, [dataProcess, firstVerifyProcessId]);

  // Ambil daftar schema field dari context_template proses tersebut
  const contextFields = useMemo(
    () => selectedProcessObj?.context_template?.fields_schema?.fields ?? [],
    [selectedProcessObj],
  );

  // Validasi apakah ada field required yang kosong
  const hasMissingRequiredContext = useMemo(() => {
    return contextFields.some((field: any) => {
      if (!field.required) return false;
      const val = contextData[field.key];
      return !val || String(val).trim() === "";
    });
  }, [contextFields, contextData]);

  const handleConfirmFirstVerify = () => {
    if (!firstVerifyProcessId || !firstVerifyStaffId) return;
    verifyFirst(firstVerifyProcessId, {
      staff_id: firstVerifyStaffId,
      notes: firstVerifyNotes,
      context_data: contextData,
    });
  };

  const handleTemplateChange = (val: string | number) => {
    setFirstVerifyProcessId(val);
    setContextData({});
  };

  return {
    dataProcess,
    loadingProcess,
    isFirstVerifyModalOpen,
    setIsFirstVerifyModalOpen,
    firstVerifyProcessId,
    handleTemplateChange,
    firstVerifyStaffId,
    setFirstVerifyStaffId,
    firstVerifyNotes,
    setFirstVerifyNotes,
    contextData,
    setContextData,
    contextFields,
    hasMissingRequiredContext,
    loadingFirstVerify,
    handleConfirmFirstVerify,
  };
}
