import { useEffect, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { decrypt } from "@/utils/secureStorage";
import { panelService } from "@iptv/services/panelService";
import { IPTV_BASE_URL } from "@/services/api/endpoints";

export type RealtimeStatus = "connecting" | "connected" | "offline";

class FatalError extends Error {}

const RETRY_MS = 3000;
const normalizedBaseUrl = IPTV_BASE_URL.replace(/\/+$/, "");
const SSE_URL = `${normalizedBaseUrl}/panel/events`;

interface StoredUser {
  token: string;
}

export function useNurseRealtime(refetchActive: () => void) {
  const [status, setStatus] = useState<RealtimeStatus>("connecting");

  useEffect(() => {
    const encryptedData = localStorage.getItem("user");
    let token = "";

    if (encryptedData) {
      const decrypted = decrypt<StoredUser>(encryptedData);

      if (decrypted?.token) {
        token = decrypted.token;
      }
    }

    if (!token) {
      console.error("Token tidak ditemukan untuk koneksi Nurse SSE.");
      return;
    }

    let disposed = false;
    const controller = new AbortController();

    const heartbeatInterval = window.setInterval(() => {
      panelService.sendHeartbeat().catch(() => {});
    }, 30000);

    void fetchEventSource(SSE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      openWhenHidden: true,

      async onopen(response) {
        if (response.ok) {
          if (!disposed) setStatus("connected");
          return;
        }
        if (response.status === 401 || response.status === 403) {
          throw new FatalError(`SSE ditolak: ${response.status}`);
        }
        throw new Error(`SSE bermasalah: ${response.status}`);
      },

      onmessage(message) {
        if (disposed) return;

        const relevantEvents = [
          "snapshot",
          "call.created",
          "call.updated",
          "call.acked",
          "call.resolved",
        ];

        if (relevantEvents.includes(message.event)) {
          refetchActive();
        }
      },

      onclose() {
        if (!disposed) {
          throw new Error("SSE terputus");
        }
      },

      onerror(err) {
        if (disposed) return;
        setStatus("offline");
        if (err instanceof FatalError) {
          throw err;
        }
        return RETRY_MS;
      },
    }).catch(() => {
      if (!disposed) {
        setStatus("offline");
      }
    });

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchActive();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      disposed = true;
      controller.abort();
      window.clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchActive]);

  return { status };
}
