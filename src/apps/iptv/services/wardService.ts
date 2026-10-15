import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { WardItem } from "../types/wardTypes";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const wardService = {
  ...createCrudService<WardItem>("/admin/wards", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),

  async archive(id: string): Promise<WardItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/wards/${id}/archive`,
    );
    return normalizeDetail<WardItem>(response);
  },
};
