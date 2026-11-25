import type { CallItem } from "./callTypes";
import type { StationItem } from "./stationTypes";
import type { WardItem } from "./wardTypes";

export interface PanelItem {
  id: string;
  station: StationItem | null;
  ward: WardItem | null;
  calls: CallItem | null;
}

export const defaultPanel: PanelItem = {
  id: "",
  station: null,
  ward: null,
  calls: null,
};

export interface PanelStbItem {
  devices: [];
  offline: boolean;
  station: StationItem;
}
