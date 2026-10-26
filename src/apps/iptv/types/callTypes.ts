export interface CallItem {
  id: string;
  kind: string;
  status: string;
  press_count: number;
  bed_id: string;
  room_id: string;
  ward_id: string;
  room_label: string;
  ward_name: string;
  acked_at: string;
  acked_by: string;
  resolved_at: string;
  first_pressed_at: string;
  last_pressed_at: string;
  created_at: string;
}

export const defaultCall: CallItem = {
  id: "",
  kind: "",
  status: "",
  press_count: 0,
  bed_id: "",
  room_id: "",
  ward_id: "",
  room_label: "",
  ward_name: "",
  acked_at: "",
  acked_by: "",
  resolved_at: "",
  first_pressed_at: "",
  last_pressed_at: "",
  created_at: "",
};

export const validateCall = (_payload: CallItem): string[] => {
  const errors: string[] = [];

  // if (!payload.station_id || payload.station_id.trim() === "") {
  //   errors.push("Station is required.");
  // }

  return errors;
};
