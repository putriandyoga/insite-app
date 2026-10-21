import { createCrudService } from "@/services/core/createCrudService";
import type { ContextItem, FieldsSchema } from "../types/contextTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const contextService = {
  ...createCrudService<ContextItem>("/context-templates", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),

  async validateSchema(fieldsSchema: FieldsSchema) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      "/context-templates/validate-schema",
      {
        fields_schema: fieldsSchema,
      },
    );
    return normalizeDetail<FieldsSchema>(response);
  },
};
