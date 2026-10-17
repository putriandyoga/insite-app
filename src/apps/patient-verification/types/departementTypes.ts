import type { BaseItem } from "@/types/base.types";

export interface DepartementItem extends BaseItem {
  id: string;
  name: string;
  staffs_count: number;
  users_count: number;
}

export const defaultDepartement: DepartementItem = {
  id: "",
  name: "",
  staffs_count: 0,
  users_count: 0,
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const validateDepartement = (payload: DepartementItem): string[] => {
  const errors: string[] = [];

  if (!payload.name) {
    errors.push("Departement name is required.");
  }

  return errors;
};
