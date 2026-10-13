import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbDeleteEnrollmentCode(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const deleteEnrollmentCode = async (id: string) => {
    const result = await showAlert({
      title: "Cabut Kode Enrollment?",
      text: "Apakah Anda yakin ingin mencabut kode enrollment STB ini?",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Cabut",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.deleteEnrollmentCode(id);

      await showAlert({
        title: "Berhasil!",
        text: "Kode enrollment berhasil dicabut.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(
        err,
        "Terjadi kesalahan saat mencabut kode enrollment",
      );
    } finally {
      setLoading(false);
    }
  };

  return { deleteEnrollmentCode, loading };
}
