import { useEffect, useState, useRef } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { decrypt } from "@/utils/secureStorage";
import { panelService } from "@iptv/services/panelService";
import { usePanelMe } from "../../hooks/panel/use-panel-me";
import { usePanelActiveCalls } from "../../hooks/panel/use-panel-active-call";
import { usePanelStbs } from "../../hooks/panel/use-panel-stb";
import { usePanelCallAction } from "../../hooks/panel/use-panel-action";

interface StoredUser {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
    permissions: Array<{ id: string; name: string }>;
  };
}

export default function NurseCallMonitor() {
  const [status] = useState<string>("terhubung");
  const [statusWarna] = useState<string>("#3fb950");

  // Audio states
  const [suaraTersedia, setSuaraTersedia] = useState<boolean>(false);
  const [berbunyi, setBerbunyi] = useState<boolean>(false);
  const [tampilkanTombolSuara, setTampilkanTombolSuara] =
    useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 1. Gunakan Custom Hooks Tanstack Query yang sudah ada
  const { data: meData } = usePanelMe();
  const { data: activeData, refetch: refetchActive } = usePanelActiveCalls();
  const { data: stbsData } = usePanelStbs();
  const { acknowledgeCall, resolveCall, loadingId } = usePanelCallAction(() => {
    refetchActive();
  });

  // Perbaikan: Langsung ambil dari objek datanya karena sudah dinormalisasi oleh service
  const resolvedMe = meData;
  const resolvedActive = activeData;
  const resolvedStbs = stbsData;

  const wardName =
    resolvedMe?.ward?.name ||
    resolvedActive?.calls?.[0]?.ward_name ||
    "memuat ward...";
  const namaStation =
    resolvedMe?.station?.name || resolvedActive?.station?.name || "";
  const calls = resolvedActive?.calls || [];
  const devices = resolvedStbs?.devices || [];
  // Inisialisasi Audio Element
  useEffect(() => {
    audioRef.current = new Audio("/assets/alarm.mp3");
    audioRef.current.loop = true;

    const handlePageShow = () => {
      if (!suaraTersedia) setTampilkanTombolSuara(true);
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [suaraTersedia]);

  // Logika Perbarui Suara Alarm berdasarkan PENDING calls
  useEffect(() => {
    const adaYangMenunggu = calls.some((c: any) => c.status === "PENDING");
    if (!suaraTersedia || !audioRef.current) return;

    if (adaYangMenunggu && !berbunyi) {
      audioRef.current.play().catch(() => {
        setTampilkanTombolSuara(true);
      });
      setBerbunyi(true);
    } else if (!adaYangMenunggu && berbunyi) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setBerbunyi(false);
    }
  }, [calls, suaraTersedia, berbunyi]);

  const bukaSuara = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setSuaraTersedia(true);
      setTampilkanTombolSuara(false);
    } catch {
      setTampilkanTombolSuara(true);
    }
  };

  // Hitung waktu relatif untuk STB
  const sejakRelative = (iso: string) => {
    const detik = Math.max(
      0,
      Math.round((Date.now() - new Date(iso).getTime()) / 1000),
    );
    if (detik < 60) return "baru saja";
    const menit = Math.round(detik / 60);
    if (menit < 60) return `${menit} menit lalu`;
    const jam = Math.round(menit / 60);
    if (jam < 24) return `${jam} jam lalu`;
    return `${Math.round(jam / 24)} hari lalu`;
  };

  // 2. Hanya SSE dan Heartbeat yang ditaruh di useEffect menggunakan fetch-event-source & service
  useEffect(() => {
    const encryptedData = localStorage.getItem("user");
    let token = "";
    if (encryptedData) {
      const decrypted = decrypt<StoredUser>(encryptedData);
      if (decrypted && decrypted.token) {
        token = decrypted.token;
      }
    }

    // Mulai Heartbeat tiap 30 detik menggunakan panelService
    const heartbeatInterval = setInterval(() => {
      panelService.sendHeartbeat().catch(() => {});
    }, 30000);

    // Sambungkan SSE untuk *real-time updates*
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
          msg.event === "snapshot" ||
          msg.event === "call.created" ||
          msg.event === "call.updated" ||
          msg.event === "call.acked" ||
          msg.event === "call.resolved" ||
          msg.event === "presence"
        ) {
          // Ketika ada event masuk, cukup panggil refetch dari Tanstack Query
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

  // Urutkan perangkat TV (yang mati ditaruh di atas)
  const sortedDevices = [...devices].sort((a: any, b: any) => {
    if (a.online !== b.online) return a.online ? 1 : -1;
    return (a.room_label || "").localeCompare(b.room_label || "");
  });

  return (
    <div className="min-h-screen bg-[#0f1720] text-[#e6edf3] font-sans">
      {/* Header */}
      <header className="p-4 px-5 border-b border-[#2b3948] flex items-center gap-4 flex-wrap">
        <h1 className="text-lg font-semibold m-0">Nurse Call</h1>
        <span className="text-[#8fa3b5] text-sm">{wardName}</span>
        <div className="ml-auto text-sm text-[#8fa3b5] flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: statusWarna }}
          ></span>
          <span>{status}</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-5 max-w-225 mx-auto">
        {tampilkanTombolSuara && (
          <div className="flex gap-3 items-center p-3 mb-3.5 border-2 border-[#d29922] rounded-lg bg-[#2d2200] text-[#f0d9a8] text-sm">
            <button
              onClick={bukaSuara}
              className="px-4 py-2 font-semibold bg-[#d29922] text-[#1a1200] rounded-md hover:bg-[#e3ac31] cursor-pointer border-none"
            >
              Aktifkan suara
            </button>
            <span>
              Browser memblokir suara otomatis sampai Anda mengeklik sekali.
            </span>
          </div>
        )}

        {/* Daftar Panggilan */}
        <ol className="list-none m-0 p-0 grid gap-3">
          {calls.length === 0 && (
            <p className="text-center py-8 text-[#8fa3b5]">
              Tidak ada panggilan aktif.
            </p>
          )}

          {calls.map((c: any) => {
            const isPending = c.status === "PENDING";
            const sudahDijawab = c.status === "ACKNOWLEDGED";

            let infoDiambil = null;
            if (sudahDijawab) {
              const olehAnda =
                c.acked_by && namaStation && c.acked_by === namaStation;
              infoDiambil = olehAnda
                ? "Anda"
                : ` oleh ${c.acked_by || "perawat lain"}`;
            }

            return (
              <li
                key={c.call_id}
                className={`bg-[#1a2430] border border-[#2b3948] rounded-lg p-3.5 flex items-center gap-3.5 flex-wrap ${
                  isPending
                    ? "border-l-4 border-l-[#d29922]"
                    : "border-l-4 border-l-[#3fb950] opacity-75"
                }`}
              >
                <span className="font-semibold text-[15px] min-w-24">
                  {c.kind}
                </span>
                <span className="text-[#8fa3b5] text-sm">
                  {c.room_label || "?"} - {c.ward_name || "?"}
                </span>

                {sudahDijawab && (
                  <span className="text-[#ffb4ab] text-[13px] font-semibold px-2.5 py-0.5 rounded-[11px] bg-[rgba(255,180,171,0.14)]">
                    {infoDiambil}
                  </span>
                )}

                <span className="text-[#8fa3b5] text-[13px] ml-auto">
                  {c.press_count > 1 ? `${c.press_count}x ditekan` : ""}
                </span>

                <button
                  className="font-inherit text-sm px-4 py-2 rounded-md border border-[#2b3948] bg-[#243244] text-[#e6edf3] cursor-pointer hover:bg-[#2d3d52] disabled:opacity-50 disabled:cursor-default"
                  disabled={loadingId === c.call_id}
                  onClick={() =>
                    isPending
                      ? acknowledgeCall(c.call_id)
                      : resolveCall(c.call_id)
                  }
                >
                  {sudahDijawab ? "Tutup" : "Jawab"}
                </button>
              </li>
            );
          })}
        </ol>

        {/* Daftar Perangkat TV / STB */}
        <div className="border-t border-[#2b3948] mt-6 pt-3 px-5 flex flex-wrap gap-2 items-center">
          <span className="text-[#8fa3b5] text-[13px] mr-1.5">
            TV di ward ini:
          </span>
          {sortedDevices.length === 0 ? (
            <span className="text-[#8fa3b5] text-[13px]">belum ada</span>
          ) : (
            sortedDevices.map((d: any) => {
              const lalu = d.last_seen_at
                ? sejakRelative(d.last_seen_at)
                : "tidak pernah";
              return (
                <span
                  key={d.serial || d.room_label}
                  className={`px-3 py-1 rounded-[13px] text-[13px] border ${
                    d.online
                      ? "text-[#7ee2a8] border-[rgba(126,226,168,0.35)]"
                      : "text-[#ffb4ab] border-[#f85149] bg-[rgba(248,81,73,0.15)] font-semibold"
                  }`}
                  title={`${d.serial}${d.online ? "" : ` — terakhir dilihat \${lalu}`}`}
                >
                  {d.room_label || d.serial} ·{" "}
                  {d.online ? "hidup" : `mati ${lalu}`}
                </span>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
