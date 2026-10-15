import type { StationItem } from "./stationTypes";

export interface UserItem {
  id: string;
  username: string;
  role: string;
  station: StationItem | null;
  status: string;
  last_login_at: string | null;
  password_changed_at: string;
  created_at: string;
  password: string;
  station_id: string | null;
}

export const defaultUser: UserItem = {
  id: "",
  username: "",
  role: "",
  station: null,
  status: "ACTIVE",
  last_login_at: null,
  password_changed_at: "",
  created_at: "",
  password: "",
  station_id: "",
};

export const validateUser = (payload: UserItem): string[] => {
  const errors: string[] = [];

  if (!payload.username || payload.username.trim() === "") {
    errors.push("Username is required.");
  }
  if (!payload.role || payload.role.trim() === "") {
    errors.push("Role is required.");
  }
  if (!payload.status || payload.status.trim() === "") {
    errors.push("Status is required.");
  }
  // if (!payload.station_id || payload.station_id.trim() === "") {
  //   errors.push("Station is required.");
  // }

  return errors;
};
