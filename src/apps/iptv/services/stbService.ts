import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { EnrollmentCodeResponse, StbItem } from "../types/stbTyeps";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const stbService = {
  ...createCrudService<StbItem>("/admin/stbs", {
    api: iptvApi,
    adapter: iptvAdapter,
    updateMethod: "PATCH",
  }),

  async createEnrollmentCode(
    id: string,
    ttlHours: number = 24,
  ): Promise<EnrollmentCodeResponse> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/enrollment-codes`,
      { ttl_hours: ttlHours },
    );
    return normalizeDetail<EnrollmentCodeResponse>(response);
  },

  async deleteEnrollmentCode(id: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "DELETE",
      `/admin/stbs/${id}/enrollment-codes`,
    );
    return normalizeDetail<StbItem>(response);
  },

  async bindBed(id: string, bedId: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/binding`,
      { bed_id: bedId },
    );
    return normalizeDetail<StbItem>(response);
  },

  async unbindBed(id: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "DELETE",
      `/admin/stbs/${id}/binding`,
    );
    return normalizeDetail<StbItem>(response);
  },

  async revoke(id: string, note: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/revoke`,
      { note },
    );
    return normalizeDetail<StbItem>(response);
  },

  async revive(id: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/revive`,
    );
    return normalizeDetail<StbItem>(response);
  },

  async retire(id: string, note: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/retire`,
      { note },
    );
    return normalizeDetail<StbItem>(response);
  },
};
