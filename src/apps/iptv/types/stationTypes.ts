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

export interface UserItem {
  id: string;
  username: string;
  role: string;
  station: StationItem | null;
  status: string;
  last_login_at: string | null;
  password_changed_at: string;
  created_at: string;
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

  return errors;
};
