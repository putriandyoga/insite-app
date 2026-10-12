export interface RoomItem {
  id: string;
  ward_id: string;
  ward_name: string;
  archived: string;
  label: string;
  beds: string[];
}

export const defaultRoom: RoomItem = {
  id: "",
  ward_id: "",
  ward_name: "",
  archived: "",
  label: "",
  beds: [],
};

export const validateRoom = (payload: RoomItem): string[] => {
  const errors: string[] = [];

  if (!payload.label) {
    errors.push("Label is required.");
  }
  if (!payload.ward_id) {
    errors.push("Ward is required.");
  }
  if (!payload.beds || payload.beds.length === 0) {
    errors.push("At least one bed is required.");
  }

  return errors;
};
