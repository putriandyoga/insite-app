import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { UserItem } from "../types/userTypes";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const userService = {
  ...createCrudService<UserItem>("/admin/users", {
    api: iptvApi,
    adapter: iptvAdapter,
    updateMethod: "PATCH",
  }),

  async disable(id: string): Promise<UserItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/users/${id}/disable`,
    );
    return normalizeDetail<UserItem>(response);
  },

  async enable(id: string): Promise<UserItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/users/${id}/enable`,
    );
    return normalizeDetail<UserItem>(response);
  },

  async resetPassword(id: string, password: string): Promise<UserItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/users/${id}/reset-password`,
      { password },
    );
    return normalizeDetail<UserItem>(response);
  },

  async revokeSessions(id: string): Promise<UserItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "DELETE",
      `/admin/users/${id}/sessions`,
    );
    return normalizeDetail<UserItem>(response);
  },
};
