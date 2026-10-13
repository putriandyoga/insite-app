import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { StbItem } from "../types/stbTyeps";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const stbService = {
  ...createCrudService<StbItem>("/admin/stbs", {
    api: iptvApi,
    adapter: iptvAdapter,
    updateMethod: "PATCH",
  }),

  // --- Enrollment Codes (Menerima parameter ttlHours dengan default 24) ---
  async createEnrollmentCode(
    id: string,
    ttlHours: number = 24,
  ): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/enrollment-codes`,
      { ttl_hours: ttlHours }, // Mengirim body { ttl_hours }
    );
    return normalizeDetail<StbItem>(response);
  },

  async deleteEnrollmentCode(id: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "DELETE",
      `/admin/stbs/${id}/enrollment-codes`,
    );
    return normalizeDetail<StbItem>(response);
  },

  // --- Binding (Ikat & Lepas Bed) ---
  async bindBed(id: string, bedId: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/binding`,
      { bed_id: bedId }, // Mengirim body { bed_id }
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

  // --- Status Perangkat (Revoke, Revive, Retire) ---
  async revoke(id: string, note: string): Promise<StbItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/stbs/${id}/revoke`,
      { note }, // Mengirim body { note }
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
      { note }, // Mengirim body { note }
    );
    return normalizeDetail<StbItem>(response);
  },
};
