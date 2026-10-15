import { useState } from "react";
import { wardService } from "@iptv/services/wardService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useWardArchive(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const archiveWard = async (wardId: string) => {
    const result = await showAlert({
      title: "Arsipkan Ward?",
      text: "Apakah Anda yakin ingin mengarsipkan ward ini? Tindakan ini dapat mempengaruhi data terkait.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Arsipkan",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await wardService.archive(wardId);

      await showAlert({
        title: "Berhasil!",
        text: "Data ward berhasil diarsipkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.ward.lists(),
      });

      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mengarsipkan ward");
    } finally {
      setLoading(false);
    }
  };

  return { archiveWard, loading };
}
