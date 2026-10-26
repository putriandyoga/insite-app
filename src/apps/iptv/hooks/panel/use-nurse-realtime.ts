// hooks/panel/use-nurse-realtime.ts
import { useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { decrypt } from "@/utils/secureStorage";
import { panelService } from "@iptv/services/panelService";

interface StoredUser {
  token: string;
}

export function useNurseRealtime(refetchActive: () => void) {
  useEffect(() => {
    const encryptedData = localStorage.getItem("user");
    let token = "";
    if (encryptedData) {
      const decrypted = decrypt<StoredUser>(encryptedData);
      if (decrypted && decrypted.token) {
        token = decrypted.token;
      }
    }

    const heartbeatInterval = setInterval(() => {
      panelService.sendHeartbeat().catch(() => {});
    }, 30000);

    const controller = new AbortController();
    fetchEventSource("/iptv-api/panel/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
      async onopen(response) {
        if (!response.ok) {
          throw new Error(`Koneksi SSE bermasalah: ${response.status}`);
        }
      },
      onmessage(msg) {
        if (
          [
            "snapshot",
            "call.created",
            "call.updated",
            "call.acked",
            "call.resolved",
            "presence",
          ].includes(msg.event)
        ) {
          refetchActive();
        }
      },
      onerror(err) {
        throw err;
      },
    });

    const handleVisibilityChange = () => {
      if (!document.hidden) refetchActive();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      controller.abort();
      clearInterval(heartbeatInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetchActive]);
}
