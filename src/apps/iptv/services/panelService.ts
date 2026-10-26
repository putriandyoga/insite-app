import { createCrudService } from "@/services/core/createCrudService";
import { iptvApi } from "@/services/api/endpoints";
import { iptvAdapter } from "@/services/adapters/iptvAdapter";
import { normalizeDetail } from "@/services/normalizers/responseNormalizer";
import type { PanelItem, PanelStbItem } from "../types/panelTypes";
import type { StationItem } from "../types/stationTypes";
import type { CallItem } from "../types/callTypes";

export interface ActiveCallsResponse {
  calls: CallItem[];
  station: StationItem;
}

export const panelService = {
  ...createCrudService<PanelItem>("/panel", {
    api: iptvApi,
    adapter: iptvAdapter,
    updateMethod: "PATCH",
  }),

  // 1. GET /panel/me - Identitas station & ward perawat
  async getMe(): Promise<PanelItem> {
    const response = await iptvApi.apiRequest<PanelItem>("GET", "/panel/me");
    return normalizeDetail<PanelItem>(response);
  },

  // 2. GET /panel/active - Snapshot panggilan aktif
  async getActiveCalls(): Promise<ActiveCallsResponse> {
    const response = await iptvApi.apiRequest<unknown>("GET", "/panel/active");
    return normalizeDetail<ActiveCallsResponse>(response);
  },

  // 3. GET /panel/stbs - Daftar perangkat TV/STB di ward
  async getStbs(): Promise<PanelStbItem> {
    const response = await iptvApi.apiRequest<unknown>("GET", "/panel/stbs");
    return normalizeDetail<PanelStbItem>(response);
  },

  // 4. POST /panel/heartbeat - Sinyal berkala tanda station aktif
  async sendHeartbeat() {
    return await iptvApi.apiRequest<unknown>("POST", "/panel/heartbeat", {});
  },

  // 5. POST /panel/calls/{id}/ack - Mengubah status PENDING -> ACKNOWLEDGED
  async acknowledgeCall(callId: string) {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/panel/calls/${callId}/ack`,
    );
    return normalizeDetail<CallItem>(response);
  },

  // 6. POST /panel/calls/{id}/resolve - Menyelesaikan panggilan
  async resolveCall(callId: string) {
    const response = await iptvApi.apiRequest<unknown>(
      "POST",
      `/panel/calls/${callId}/resolve`,
    );
    return normalizeDetail<CallItem>(response);
  },
};
