import type { BaseItem } from "@/types/base.types";
import { defaultProcess, type ProcessItem } from "./processTypes";
import { type ContextItem } from "./contextTypes";

export interface StageDepartment {
  departemen_id: number;
  name: string;
  is_mandatory: boolean;
}

export interface CurrentStageItem {
  id: number;
  stage_name: string;
  stage_order: number;
  departments: StageDepartment[];
}

export interface StageTimelineItem {
  stage_order: number;
  stage_name: string;
  status: "completed" | "current" | "pending" | string;
  verified_count: number;
  first_verified_at: string | null;
  departments: StageDepartment[];
}

export interface InstancesItem extends BaseItem {
  ticket_code: string;
  process: ProcessItem;
  status: string;
  context_data: Record<string, any>;
  context_changes_count: number;
  context_template?: ContextItem & { fields?: any[] };
  current_stage?: CurrentStageItem;
  stages_timeline?: StageTimelineItem[];
  total_stages?: number;
  progress_percentage?: number;
  started_at: string;
  completed_at: string | null;
  cancelled_at?: string | null;
  cancel_reason?: string | null;
  total_duration_minutes?: number;
  is_waiting_my_department: boolean;
  has_my_department_verified?: boolean;
  my_department_relation?: string;
}

export const defaultInstances: InstancesItem = {
  id: "",
  ticket_code: "",
  process: defaultProcess,
  status: "",
  context_data: {},
  context_changes_count: 0,
  current_stage: undefined,
  stages_timeline: [],
  total_stages: 0,
  progress_percentage: 0,
  started_at: "",
  completed_at: null,
  is_waiting_my_department: false,
  createdAt: "",
  updatedAt: "",
  deletedAt: null,
  name: "",
};

export const validateInstances = (payload: InstancesItem): string[] => {
  const errors: string[] = [];

  if (!payload.ticket_code) {
    errors.push("Ticket code is required.");
  }

  if (!payload.status) {
    errors.push("Status is required.");
  }

  return errors;
};
