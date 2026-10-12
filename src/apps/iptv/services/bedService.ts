import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { BedItem } from "../types/bedTypes";

export const bedService = {
  ...createCrudService<BedItem>("/admin/beds", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),
};
