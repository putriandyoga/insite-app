// hooks/instances/use-instances-verify-next.ts
import { useState } from "react";
import { instancesService } from "@patient-verification/services/instancesService";
import { useQueryClient } from "@tanstack/react-query";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

interface VerifyPayload {
  staff_id: number | string;
  notes?: string;
}

export function useInstanceVerifyNext(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const verifyNext = async (id: string | number, data: VerifyPayload) => {
    try {
      setLoading(true);
      await instancesService.verifyNext(id, data);

      await showAlert({
        title: "Berhasil!",
        text: "Verifikasi tahap lanjutan berhasil disimpan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      // INVALIDASI SELURUH QUERY INSTANCE AGAR CACHE BERSIH TOTAL
      await queryClient.invalidateQueries({
        queryKey: ["instances"],
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat verifikasi lanjutan");
    } finally {
      setLoading(false);
    }
  };

  return { verifyNext, loading };
}
