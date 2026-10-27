import type { BaseItem } from "@/types/base.types";
import { defaultContext, type ContextItem } from "./contextTypes";

export interface ProcessItem extends BaseItem {
  name: string;
  process_code: string;
  version: string;
  status: string;
  is_current: boolean;
  description: string;
  context_template_id: number;
  context_template: ContextItem;
  total_stages: number;
  total_departements: number;
  total_instances: number;
  has_instances: boolean;
  created_by_name: string;
  stages: Stages[];
}

export const defaultProcess: ProcessItem = {
  id: "",
  name: "",
  description: "",
  process_code: "",
  version: "",
  status: "",
  is_current: false,
  context_template_id: 0,
  context_template: defaultContext,
  total_stages: 0,
  total_departements: 0,
  total_instances: 0,
  has_instances: false,
  created_by_name: "",
  stages: [],
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
};

export const validateProcess = (payload: ProcessItem): string[] => {
  const errors: string[] = [];
  if (!payload.name) {
    errors.push("Template name is required.");
  }

  if (!payload.description) {
    errors.push("Description is required.");
  }

  return errors;
};

export interface StageDepartmentItem {
  id: number;
  departemen_id: number;
  departemen_name: string;
  is_mandatory: boolean;
}

export interface Stages {
  id: number;
  stage_name: string;
  stage_order: number;
  description: string | null;
  is_required: boolean;
  departments: StageDepartmentItem[];
}
