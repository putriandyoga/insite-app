import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { UserItem } from "../types/userTypes";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const userService = {
  ...createCrudService<UserItem>("/admin/users", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),

  async archive(id: string): Promise<UserItem> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/admin/users/${id}/archive`,
    );
    return normalizeDetail<UserItem>(response);
  },
};
