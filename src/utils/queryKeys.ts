import { createQueryKeys } from "./queryKeyFactory";

export const queryKeys = {
  station: createQueryKeys("station"),
  ward: createQueryKeys("ward"),
  room: createQueryKeys("room"),
  bed: createQueryKeys("bed"),
  user: createQueryKeys("user"),
  stb: createQueryKeys("stb"),
  call: createQueryKeys("call"),
  panel: {
    ...createQueryKeys("panel"),
    me: () => ["panel", "me"] as const,
    active: () => ["panel", "active"] as const,
    stbs: () => ["panel", "stbs"] as const,
  },

  // Patient Verification
  departement: createQueryKeys("departement"),
  staff: createQueryKeys("staff"),
  context: createQueryKeys("context"),
  process: createQueryKeys("process"),
  instances: createQueryKeys("instances"),
};
