import { createCrudService } from "@/services/core/createCrudService";
import type { ProcessItem } from "../types/processTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

export const processService = {
  ...createCrudService<ProcessItem>("/processes", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),

  // Membuat versi baru dari process berdasarkan process-id
  async createNewVersion(processId: string | number) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/processes/${processId}/new-version`,
    );
    return normalizeDetail<ProcessItem>(response);
  },

  // Mempublikasikan process
  async publish(processId: string | number) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/processes/${processId}/publish`,
    );
    return normalizeDetail<ProcessItem>(response);
  },

  // Mengarsipkan process (Archive)
  async archive(processId: string | number) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/processes/${processId}/archive`,
    );
    return normalizeDetail<ProcessItem>(response);
  },

  // Mengembalikan process ke status draft (Revert to Draft)
  async revertToDraft(processId: string | number) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/processes/${processId}/revert-to-draft`,
    );
    return normalizeDetail<ProcessItem>(response);
  },
};
