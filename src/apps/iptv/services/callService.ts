import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { CallItem } from "../types/callTypes";

export const callService = {
  ...createCrudService<CallItem>("/admin/calls", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),
};
