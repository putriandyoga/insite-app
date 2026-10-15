import { createQueryKeys } from "./queryKeyFactory";

export const queryKeys = {
  station: createQueryKeys("station"),
  ward: createQueryKeys("ward"),
  room: createQueryKeys("room"),
  bed: createQueryKeys("bed"),
  user: createQueryKeys("user"),
  stb: createQueryKeys("stb"),
};
