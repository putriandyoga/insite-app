import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/components/Alert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbRetire(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const retireStb = async (id: string, note: string) => {
    const result = await showAlert({
      title: "Pensiunkan (Retire) STB?",
      text: "Perangkat akan dipensiunkan/diganti secara permanen.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Retire",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.retire(id, note);

      await showAlert({
        title: "Berhasil!",
        text: "Perangkat berhasil dipensiunkan.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat retire perangkat");
    } finally {
      setLoading(false);
    }
  };

  return { retireStb, loading };
}
