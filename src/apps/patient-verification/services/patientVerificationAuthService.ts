import { patientVerificationApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";
import type {
  LoginResponseData,
  PatientUserItem,
} from "@/apps/patient-verification/types/userTypes";

export const patientAuthService = {
  async login(payload: {
    username: string;
    password: string;
  }): Promise<LoginResponseData> {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "POST",
      "/login",
      payload,
    );
    return normalizeDetail<LoginResponseData>(response);
  },

  async logout(): Promise<void> {
    await patientVerificationApi.apiRequest<void>("POST", "/logout");
  },

  async getProfile(): Promise<PatientUserItem> {
    const response = await patientVerificationApi.apiRequest<unknown>(
      "GET",
      "/me",
    );
    return normalizeDetail<PatientUserItem>(response);
  },
};
