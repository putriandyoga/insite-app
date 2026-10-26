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

export const validatePanel = (_payload: PanelItem): string[] => {
  const errors: string[] = [];

  //   if (!payload.name || payload.name.trim() === "") {
  //     errors.push("Panel name is required.");
  //   }
  //   if (!payload.ward_id || payload.ward_id.trim() === "") {
  //     errors.push("Ward is required.");
  //   }
  //   if (!payload.status || payload.status.trim() === "") {
  //     errors.push("Status is required.");
  //   }

  return errors;
};

export interface PanelStbItem {
  devices: [];
  offline: boolean;
  station: StationItem;
}
