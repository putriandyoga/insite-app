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

  async rebootStation(id: string): Promise<any> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stations/${id}/reboot`,
    );

    return normalizeDetail<any>(response);
  },
};
