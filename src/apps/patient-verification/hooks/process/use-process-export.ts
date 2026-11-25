import { useState } from "react";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";
import { processService } from "@patient-verification/services/processService";

interface ExportParams {
  date_from: string;
  date_to: string;
}

interface BulkExportParams extends ExportParams {
  process_ids: (string | number)[];
}

// Hook untuk export 1 process
export function useProcessExport(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const exportProcess = async (id: string | number, params: ExportParams) => {
    try {
      setLoading(true);
      await processService.exportProcess(id, params);

      await showAlert({
        title: "Berhasil!",
        text: "Report process berhasil diexport.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mengexport process");
    } finally {
      setLoading(false);
    }
  };

  return { exportProcess, loading };
}

// Hook untuk bulk export multiple process
export function useProcessBulkExport(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);

  const exportBulk = async (params: BulkExportParams) => {
    try {
      setLoading(true);
      await processService.exportBulk(params);

      await showAlert({
        title: "Berhasil!",
        text: "Bulk report berhasil diexport.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat melakukan bulk export");
    } finally {
      setLoading(false);
    }
  };

  return { exportBulk, loading };
}
