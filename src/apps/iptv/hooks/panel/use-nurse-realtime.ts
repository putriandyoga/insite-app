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

      if (decrypted?.token) {
        token = decrypted.token;
      }
    }

    if (!token) {
      console.error("Token tidak ditemukan untuk koneksi Nurse SSE.");
      return;
    }

    let disposed = false;

    const heartbeatInterval = window.setInterval(() => {
      panelService.sendHeartbeat().catch(() => {});
    }, 30000);

    const controller = new AbortController();

    void fetchEventSource("/iptv-api/panel/events", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      openWhenHidden: true,

      async onopen(response) {
        if (!response.ok) {
          throw new Error(`Koneksi SSE bermasalah: ${response.status}`);
        }
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
          // Data SSE menjadi pemicu pembaruan query.
          refetchActive();
        }
      },

      onclose() {
        if (!disposed) {
          throw new Error("Koneksi Nurse SSE terputus.");
        }
      },

      onerror(error) {
        if (disposed) return;

        // fetch-event-source akan mencoba menyambung ulang.
        console.error("Nurse SSE terputus, mencoba menyambung ulang.", error);
        throw error;
      },
    }).catch((error) => {
      if (!disposed && !controller.signal.aborted) {
        console.error("Nurse SSE gagal:", error);
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
}
