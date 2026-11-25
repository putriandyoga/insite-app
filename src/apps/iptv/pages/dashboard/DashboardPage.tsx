import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePanelMe } from "@iptv/hooks/panel/use-panel-me";
import { usePanelActiveCalls } from "@iptv/hooks/panel/use-panel-active-call";
import { usePanelStbs } from "@iptv/hooks/panel/use-panel-stb";
import { usePanelCallAction } from "@iptv/hooks/panel/use-panel-action";
import { useNurseAudio } from "@iptv/hooks/panel/use-nurse-audio";
import {
  useNurseRealtime,
  type RealtimeStatus,
} from "@iptv/hooks/panel/use-nurse-realtime";
import { AudioAlertBanner } from "@iptv/components/AudioAlertBanner";
import { CallItemCard } from "@iptv/components/CallItemCard";
import { StbDeviceCard } from "../../components/StbDeviceCard";

function formatRelativeSeconds(iso: string, referenceNowMs: number): string {
  const detik = Math.max(
    0,
    Math.round((referenceNowMs - new Date(iso).getTime()) / 1000),
  );
  if (detik < 60) return "Baru saja";
  const menit = Math.round(detik / 60);
  if (menit < 60) return `${menit}m lalu`;
  const jam = Math.round(menit / 60);
  if (jam < 24) return `${jam}j lalu`;
  return `${Math.round(jam / 24)}h lalu`;
}

function getRealtimeBadgeConfig(status: RealtimeStatus) {
  switch (status) {
    case "connected":
      return {
        label: "Terhubung",
        pingClass: "bg-success",
        dotClass: "bg-success",
      };
    case "connecting":
      return {
        label: "Menyambung…",
        pingClass: "bg-warning",
        dotClass: "bg-warning",
      };
    case "offline":
    default:
      return {
        label: "Terputus",
        pingClass: "bg-error",
        dotClass: "bg-error",
      };
  }
}

const DashboardPage = () => {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const { data: meData } = usePanelMe();
  const { data: activeData, refetch: refetchActive } = usePanelActiveCalls();
  const { data: stbsData } = usePanelStbs();
  const { acknowledgeCall, resolveCall, loadingId } = usePanelCallAction(() => {
    refetchActive();
  });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const resolvedMe = meData;
  const resolvedActive = activeData;
  const resolvedStbs = stbsData;

  const wardName =
    resolvedMe?.ward?.name ||
    resolvedActive?.calls?.[0]?.ward_name ||
    "Memuat ward...";
  const namaStation =
    resolvedMe?.station?.name || resolvedActive?.station?.name || "";

  const calls = useMemo(() => {
    const list = resolvedActive?.calls ?? [];
    return list.filter((call: any) => call.status !== "");
  }, [resolvedActive?.calls]);

  const devices = useMemo(
    () => resolvedStbs?.devices ?? [],
    [resolvedStbs?.devices],
  );

  const { tampilkanTombolSuara, bukaSuara } = useNurseAudio(calls);
  const { status } = useNurseRealtime(refetchActive);
  const badgeConfig = getRealtimeBadgeConfig(status);

  const sejakRelative = useCallback(
    (iso: string) => formatRelativeSeconds(iso, nowMs),
    [nowMs],
  );

  const sortedDevices = useMemo(() => {
    return [...devices].sort((a: any, b: any) => {
      if (a.online !== b.online) return a.online ? 1 : -1;
      return (a.room_label || "").localeCompare(b.room_label || "");
    });
  }, [devices]);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden bg-base-100/50">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[{ label: "Home", path: "/" }, { label: "Dashboard" }]}
            />
          </div>

          <div className="flex items-center gap-3 bg-base-200/60 px-3.5 py-1.5 rounded-full border border-base-300">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${badgeConfig.pingClass} opacity-75`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${badgeConfig.dotClass}`}
              />
            </span>
            <span className="text-caption font-medium text-base-content">
              {badgeConfig.label}
            </span>
            <span className="text-caption border-l border-base-300 pl-3">
              {wardName}
            </span>
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto md:overflow-hidden h-full p-6 shadow-md border border-base-300 bg-base-100">
          <AudioAlertBanner
            tampilkan={tampilkanTombolSuara}
            onBukaSuara={bukaSuara}
          />

          <div className="flex items-center justify-between shrink-0 border-b border-base-200 pb-3">
            <div>
              <h2 className="heading-h2 text-base-content">
                Nurse Call Monitor
              </h2>
              <p className="text-caption mt-0.5">
                Pantau panggilan perawat secara real-time dari setiap ruangan.
              </p>
            </div>
          </div>

          <div className="shrink-0 space-y-2">
            <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider">
              Perangkat TV
            </h3>

            {sortedDevices.length === 0 ? (
              <div className="text-caption italic py-2 text-base-content/50">
                Belum ada perangkat terdaftar
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                {sortedDevices.map((d: any) => {
                  const lalu = d.last_seen_at
                    ? sejakRelative(d.last_seen_at)
                    : "Tidak pernah";
                  return (
                    <StbDeviceCard
                      key={d.id || d.serial || d.room_label}
                      device={d}
                      lalu={lalu}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {calls.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-base-300 rounded-2xl bg-base-200/30">
                <p className="heading-h4 text-base-content/60">
                  Tidak ada panggilan aktif
                </p>
                <p className="text-caption mt-1">
                  Semua panggilan di ward ini telah diselesaikan.
                </p>
              </div>
            ) : (
              <ol className="list-none m-0 p-0 grid gap-3.5">
                {calls.map((c: any) => (
                  <CallItemCard
                    key={c.call_id}
                    call={c}
                    namaStation={namaStation}
                    loadingId={loadingId}
                    onAction={(callId, isPending) =>
                      isPending ? acknowledgeCall(callId) : resolveCall(callId)
                    }
                  />
                ))}
              </ol>
            )}
          </div>
        </Card>
      </PageMiddle>
    </div>
  );
};

export default DashboardPage;
