import { createCrudService } from "@/services/core/createCrudService";
import type { StaffItem } from "../types/staffTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";

export const staffService = {
  ...createCrudService<StaffItem>("/staffs", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),
};
