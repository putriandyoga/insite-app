import { createCrudService } from "@/services/core/createCrudService";
import type { StationItem } from "../types/stationTypes";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const stationService = {
  ...createCrudService<StationItem>("/admin/stations", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),

  // Custom endpoint tambahan khusus IPTV stations
  async rebootStation(id: string): Promise<any> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stations/${id}/reboot`,
    );
    // Gunakan normalizeDetail agar konsisten dengan service lain (membuka wrapper .data jika ada)
    return normalizeDetail<any>(response);
  },
};
