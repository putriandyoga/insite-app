import { createCrudService } from "@/services/core/createCrudService";
import type { ProcessItem } from "../types/processTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

interface ExportPayload {
  date_from: string;
  date_to: string;
}

interface BulkExportPayload extends ExportPayload {
  process_ids: (string | number)[];
}

export const processService = {
  ...createCrudService<ProcessItem>("/processes", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),

  async getAll() {
    const response = await patientVerificationApi.apiRequest<any>(
      "GET",
      "/processes",
    );
    // Mengembalikan response mentah atau data terstruktur dari API
    return response;
  },
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

  // Export 1 process saja
  async exportProcess(processId: string | number, data: ExportPayload) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/reports/processes/${processId}/export`,
      data,
    );
    return response;
  },

  // Bulk export beberapa process (Payload dikirim langsung sebagai argumen ke-3)
  async exportBulk(data: BulkExportPayload) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/reports/bulk/export`,
      data,
    );
    return response;
  },
};
