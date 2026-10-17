import type { BaseItem } from "@/types/base.types";
import { defaultDepartement, type DepartementItem } from "./departementTypes";

export interface StaffItem extends BaseItem {
  id: string;
  employee_id: string;
  name: string;
  position: string;
  departemen_id: number;
  is_active: boolean;
  departement: DepartementItem;
}

export const defaultStaff: StaffItem = {
  id: "",
  name: "",
  employee_id: "",
  position: "",
  departemen_id: 0,
  is_active: false,
  departement: defaultDepartement,
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const validateStaff = (payload: StaffItem): string[] => {
  const errors: string[] = [];

  if (!payload.name) {
    errors.push("Staff name is required.");
  }

  if (!payload.position) {
    errors.push("Position is required.");
  }

  return errors;
};
