import { createCrudService } from "@/services/core/createCrudService";
import type { StaffItem } from "../types/staffTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";
import { normalizeList } from "@/services/normalizers/responseNormalizer";

export const staffService = {
  ...createCrudService<StaffItem>("/staffs", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),

  async getMyDepartment() {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "GET",
      `/staffs/my-department`,
    );
    return normalizeList<StaffItem>(response);
  },
};
