import { createCrudService } from "@/services/core/createCrudService";
import type { InstancesItem } from "../types/instancesTypes";
import { patientVerificationAdapter } from "@/services/adapters/patientVerificationAdapter";
import { patientVerificationApi } from "@/services/api/endpoints";
import {
  normalizeDetail,
  normalizeList,
} from "@/services/normalizers/responseNormalizer";

// Interface payload untuk request body
interface VerifyPayload {
  staff_id: number | string;
  notes?: string;
}

interface VerifyFirstPayload extends VerifyPayload {
  context_data: Record<string, any>;
}

interface CancelPayload {
  reason: string;
}

interface UpdateContextPayload {
  context_data: Record<string, any>;
  change_reason: string;
}

export const instancesService = {
  ...createCrudService<InstancesItem>("/instances", {
    api: patientVerificationApi,
    adapter: patientVerificationAdapter,
  }),

  // GET /instances/:id/history - Get audit trail verification & history log
  async history(instancesId: string | number): Promise<InstancesItem> {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "GET",
      `/instances/${instancesId}/history`,
    );
    return normalizeDetail<InstancesItem>(response);
  },

  // GET /instances/:id/context-logs - Get log perubahan context data
  async contextLogs(instancesId: string | number) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "GET",
      `/instances/${instancesId}/context-logs`,
    );
    return response; // Sesuaikan dengan normalizer jika diperlukan
  },

  // GET /instances/my-department - Get instances khusus departemen saya
  async getMyDepartmentInstances() {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "GET",
      `/instances/my-department`,
    );
    return normalizeList<InstancesItem>(response);
  },

  // POST /processes/:process_id/verify - Verify pertama untuk membuat instance baru
  async verifyFirst(processId: string | number, data: VerifyFirstPayload) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/processes/${processId}/verify`,
      data,
    );
    return normalizeDetail<InstancesItem>(response);
  },

  // POST /instances/:id/verify - Verify lanjutan (stage 2+)
  async verifyNext(instancesId: string | number, data: VerifyPayload) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/instances/${instancesId}/verify`,
      data,
    );
    return normalizeDetail<InstancesItem>(response);
  },

  // POST /instances/:id/cancel - Batalkan instance verifikasi (Admin only)
  async cancel(instancesId: string | number, data: CancelPayload) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      `/instances/${instancesId}/cancel`,
      data,
    );
    return normalizeDetail<InstancesItem>(response);
  },

  // PUT /instances/:id/context - Update context data (Admin only)
  async updateContext(
    instancesId: string | number,
    data: UpdateContextPayload,
  ) {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "PUT",
      `/instances/${instancesId}/context`,
      data,
    );
    return normalizeDetail<InstancesItem>(response);
  },
};
