import { wardService } from "@iptv/services/wardService";
import {
  defaultWard,
  validateWard,
  type WardItem,
} from "@iptv/types/wardTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useWardForm(wardId?: string) {
  return useBaseForm<WardItem>({
    id: wardId,

    entityName: "Ruang Perawatan",

    defaultValues: defaultWard,

    queryKey: queryKeys.ward.detail(wardId || ""),

    invalidateQueryKey: queryKeys.ward.lists(),

    getDetail: wardService.getDetail,

    createFn: wardService.create,

    updateFn: wardService.update,

    validate: validateWard,

    redirectTo: "/app/iptv/ward",

    messages: {
      createSuccess: "Ruang perawatan berhasil dibuat",

      updateSuccess: "Ruang perawatan berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data ruang perawatan",
    },
  });
}
