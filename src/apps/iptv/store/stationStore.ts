import { createTableStore } from "@/store/useTableStore";

interface StationFilters {
  status: string;
  ward_id?: string;
}

export const useStationStore = createTableStore<StationFilters>({
  status: "",
  ward_id: "",
});
