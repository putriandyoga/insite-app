import { iptvApi } from "@/services/clients/endpoints";
import { createCrudService } from "@/services/factories/createCrudService";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { StationItem } from "../types/stationTypes";

export const stationService = {
  ...createCrudService<StationItem>("/client/doctor", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),

  // Jika nanti ada custom endpoint tambahan khusus IPTV stations, bisa ditaruh di sini
  async rebootStation(id: string): Promise<any> {
    const response = await iptvApi.request<any>(
      "POST",
      `/admin/stations/${id}/reboot`,
    );
    return response.data;
  },
};
