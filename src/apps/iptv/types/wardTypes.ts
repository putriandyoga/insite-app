export interface WardItem {
  id: string;
  name: string;
  archived: string;
  created_at: string;
}

export const defaultWard: WardItem = {
  id: "",
  name: "",
  archived: "",
  created_at: "",
};

export const validateWard = (payload: WardItem): string[] => {
  const errors: string[] = [];

  if (!payload.name) {
    errors.push("Name is required.");
  }

  return errors;
};
