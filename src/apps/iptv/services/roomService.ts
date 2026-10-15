import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import type { RoomItem } from "../types/roomTypes";

export const roomService = {
  ...createCrudService<RoomItem>("/admin/rooms", {
    api: iptvApi,
    adapter: iptvAdapter,
  }),
};
