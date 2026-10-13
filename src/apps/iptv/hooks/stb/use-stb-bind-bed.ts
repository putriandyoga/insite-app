import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbBindBed(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const bindBed = async (id: string, bedId: string) => {
    const result = await showAlert({
      title: "Ikat STB ke Bed?",
      text: "STB akan dihubungkan ke bed perawatan yang dipilih.",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Ikat",
      confirmButtonColor: "primary" as DaisyColor,
      cancelButtonText: "Batal",
    });

    // Pastikan result bernilai true (karena showAlert mengembalikan true jika tombol konfirmasi diklik)
    if (result !== true) return;

    try {
      setLoading(true);
      await stbService.bindBed(id, bedId);

      await showAlert({
        title: "Berhasil!",
        text: "STB berhasil diikat ke bed.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat mengikat STB");
    } finally {
      setLoading(false);
    }
  };

  return { bindBed, loading };
}
