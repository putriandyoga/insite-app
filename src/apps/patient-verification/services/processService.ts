import { createCrudService } from "@/services/core/createCrudService";
import type { ProcessItem } from "../types/processTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";

export const processService = {
  ...createCrudService<ProcessItem>("/processes", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),
};
