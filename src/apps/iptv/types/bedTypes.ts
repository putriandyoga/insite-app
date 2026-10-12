export interface BedItem {
  id: string;
  room_id: string;
  room_label: string;
  ward_id: string;
  ward_name: string;
  label: string;
  archived: string;
}

export const defaultBed: BedItem = {
  id: "",
  room_id: "",
  room_label: "",
  ward_id: "",
  ward_name: "",
  label: "",
  archived: "",
};

export const validateBed = (payload: BedItem): string[] => {
  const errors: string[] = [];

  if (!payload.label) {
    errors.push("Label is required.");
  }
  if (!payload.ward_id) {
    errors.push("Ward is required.");
  }
  if (!payload.room_id) {
    errors.push("Room is required.");
  }

  return errors;
};
