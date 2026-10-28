// hooks/instance/use-instance-verify-first.ts
import { useState } from "react";
import { instancesService } from "@patient-verification/services/instancesService"; // Sesuaikan path import service Anda
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys"; // Sesuaikan path queryKeys Anda
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

interface VerifyFirstPayload {
  staff_id: number | string;
  context_data: Record<string, any>;
  notes?: string;
}

export function useInstanceVerifyFirst(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const verifyFirst = async (
    processId: string | number,
    data: VerifyFirstPayload,
  ) => {
    try {
      setLoading(true);
      await instancesService.verifyFirst(processId, data);

      await showAlert({
        title: "Berhasil!",
        text: "Verifikasi pertama berhasil dan instance baru telah dibuat.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.instances?.lists?.() ?? ["instances"],
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat melakukan verifikasi pertama",
      );
    } finally {
      setLoading(false);
    }
  };

  return { verifyFirst, loading };
}
