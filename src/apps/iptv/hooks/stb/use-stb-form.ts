import { stbService } from "@iptv/services/stbService";
import { defaultStb, validateStb, type StbItem } from "@iptv/types/stbTyeps";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useStbForm(stbId?: string) {
  return useBaseForm<StbItem>({
    id: stbId,

    entityName: "STB",

    defaultValues: defaultStb,

    queryKey: queryKeys.stb.detail(stbId || ""),

    invalidateQueryKey: queryKeys.stb.lists(),

    getDetail: stbService.getDetail,

    createFn: stbService.create,

    updateFn: stbService.update,

    validate: validateStb,

    // Gunakan ini untuk membatasi payload yang dikirim ke backend
    transformBeforeSubmit: (data) => {
      // Jika sedang membuat baru (create), hanya kirim serial dan note
      if (!stbId) {
        return {
          serial: data.serial,
          note: data.note,
        };
      }
      // Jika edit, kembalikan data apa adanya (atau sesuaikan kebutuhan)
      return data;
    },

    redirectTo: "/app/iptv/stb",

    messages: {
      createSuccess: "STB berhasil dibuat",

      updateSuccess: "STB berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data STB",
    },
  });
}
