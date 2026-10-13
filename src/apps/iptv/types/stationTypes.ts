export interface StationItem {
  id: string;
  name: string;
  ward_id: string;
  ward_name: string;
  status: "ACTIVE" | "INACTIVE" | string;
  live: boolean;
  heartbeat_fresh: boolean;
  online: boolean;
  last_seen_at: string;
  session_version: number;
}

export const defaultStation: StationItem = {
  id: "",
  name: "",
  ward_id: "",
  ward_name: "",
  status: "ACTIVE",
  live: false,
  heartbeat_fresh: false,
  online: false,
  last_seen_at: "",
  session_version: 0,
};

export const validateStation = (payload: StationItem): string[] => {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim() === "") {
    errors.push("Station name is required.");
  }
  if (!payload.ward_id || payload.ward_id.trim() === "") {
    errors.push("Ward is required.");
  }
  if (!payload.status || payload.status.trim() === "") {
    errors.push("Status is required.");
  }

  return errors;
};
