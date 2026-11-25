import { useState } from "react";
import { stbService } from "@iptv/services/stbService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/utils/queryKeys";
import type { DaisyColor } from "@/utils/color";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

export function useStbUnbindBed(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const unbindBed = async (id: string) => {
    const result = await showAlert({
      title: "Lepas Ikat Bed?",
      text: "STB akan dilepaskan dari ikatan bed saat ini.",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Lepas",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    try {
      setLoading(true);
      await stbService.unbindBed(id);

      await showAlert({
        title: "Berhasil!",
        text: "Ikatan bed berhasil dilepas.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.stb.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.stb.detail(id) });
      if (onSuccess) onSuccess();
    } catch (err) {
      await handleApiError(err, "Terjadi kesalahan saat melepas ikatan bed");
    } finally {
      setLoading(false);
    }
  };

  return { unbindBed, loading };
}
