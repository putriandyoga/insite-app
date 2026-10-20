import { createCrudService } from "@/services/core/createCrudService";
import type { ContextItem } from "../types/contextTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";

export const contextService = {
  ...createCrudService<ContextItem>("/context-templates", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),
};
