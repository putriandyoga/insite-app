import type { BaseItem } from "@/types/base.types";

export interface ContextItem extends BaseItem {
  name: string;
  description: string;
  is_active: boolean;
  total_fields: number;
  required_fields: number;
  unique_identifiers: string[];
  used_by_processes_count: number;
  created_by_name: string;
  used_by_processes?: UsedByProcess[];
  fields_summary?: FieldsSummary;
  fields_schema?: {
    fields: FormField[];
  };
}

export const defaultContext: ContextItem = {
  id: "",
  name: "",
  description: "",
  is_active: false,
  total_fields: 0,
  required_fields: 0,
  unique_identifiers: [],
  used_by_processes_count: 0,
  created_by_name: "",
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const validateContext = (payload: ContextItem): string[] => {
  const errors: string[] = [];
  if (!payload.name) {
    errors.push("Template name is required.");
  }

  if (!payload.description) {
    errors.push("Description is required.");
  }

  if (payload.total_fields < 0) {
    errors.push("Total fields cannot be negative.");
  }

  if (payload.required_fields < 0) {
    errors.push("Required fields cannot be negative.");
  }
  return errors;
};

export interface UsedByProcess {
  id: number; // Disesuaikan dengan JSON (number) atau string jika fleksibel
  name: string;
  is_active: boolean;
}

export interface FieldsSummary {
  total_fields: number;
  required_fields: number;
  unique_identifiers: string[]; // Diperbaiki dari [] menjadi string[]
  field_types: Record<string, number>; // Diperbaiki dari {} menjadi Record fleksibel
}

export interface FormField {
  key: string;
  type: string;
  label: string;
  required: boolean;
  placeholder: string;
  unique_identifier: boolean;
  display_role: string;
}
