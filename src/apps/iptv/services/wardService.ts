import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { WardItem } from "../types/wardTypes";
// import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const wardService = {
  ...createCrudService<WardItem>("/admin/wards", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),

  // Custom endpoint tambahan khusus IPTV wards
  // async rebootStation(id: string): Promise<any> {
  //   const response = await iptvApi.apiRequest<unknown>(
  //     "POST",
  //     `/admin/wards/${id}/reboot`,
  //   );
  //   // Gunakan normalizeDetail agar konsisten dengan service lain (membuka wrapper .data jika ada)
  //   return normalizeDetail<any>(response);
  // },
};
