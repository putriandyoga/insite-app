import { createCrudService } from "@/services/core/createCrudService";
import type { DepartementItem } from "../types/departementTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";

export const departementService = {
  ...createCrudService<DepartementItem>("/departments", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),
};
