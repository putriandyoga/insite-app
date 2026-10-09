// C:\Project\Production\insite-react\src\services\modules\iptvAuthService.ts
import { iptvApi } from "@/services/api/endpoints";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";

interface IptvLoginPayload {
  username: string;
  password: string;
}

export interface IptvUser {
  id: string;
  username: string;
  role: string;
  station_id: string | null;
  ward_id: string | null;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface IptvSession {
  expires_at: string;
  expires_in_sec: number;
}

export interface IptvLoginResponse {
  user: IptvUser;
  session: IptvSession;
}

export const iptvAuthService = {
  async login(payload: IptvLoginPayload): Promise<IptvLoginResponse> {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      "/auth/login",
      payload,
    );

    // normalizeDetail akan otomatis membuka bungkus envelope { meta, data: { user, session } }
    return normalizeDetail<IptvLoginResponse>(response);
  },

  async logout(): Promise<void> {
    await iptvApi.apiRequest<void>("POST", "/auth/logout");
  },

  async getProfile(): Promise<IptvUser> {
    const response = await iptvApi.apiRequest<unknown>("GET", "/auth/me");
    return normalizeDetail<IptvUser>(response);
  },
};
