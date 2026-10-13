import { stationService } from "@iptv/services/stationService";
import {
  defaultStation,
  validateStation,
  type StationItem,
} from "@iptv/types/stationTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useStationForm(stationId?: string) {
  return useBaseForm<StationItem>({
    id: stationId,

    entityName: "Station",

    defaultValues: defaultStation,

    queryKey: queryKeys.station.detail(stationId || ""),

    invalidateQueryKey: queryKeys.station.lists(),

    getDetail: stationService.getDetail,

    createFn: stationService.create,

    updateFn: stationService.update,

    validate: validateStation,

    redirectTo: "/app/iptv/station",

    messages: {
      createSuccess: "Station berhasil dibuat",

      updateSuccess: "Station berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data station",
    },
  });
}
