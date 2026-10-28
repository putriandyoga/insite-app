import React from "react";
import { Tv, Wifi, WifiOff, Clock } from "lucide-react";

interface StbDeviceCardProps {
  device: {
    id: string;
    serial: string;
    bed_id?: string;
    room_label?: string;
    ward_name?: string;
    status: string;
    online: boolean;
    last_seen_at?: string;
  };
  lalu: string;
}

export const StbDeviceCard: React.FC<StbDeviceCardProps> = ({
  device,
  lalu,
}) => {
  const { serial, room_label, ward_name, status, online } = device;

  return (
    <div
      className={`p-3.5 rounded-xl border border-base-300 bg-base-100 flex flex-col justify-between gap-2.5 shadow-xs transition-all duration-200 hover:border-base-content/20`}
      title={`Serial: ${serial}${online ? "" : ` — Terakhir dilihat ${lalu}`}`}
    >
      {/* Bagian Header: Ikon TV, Ruangan, & Status Titik Online */}
      <div className="flex items-center justify-between gap-2 border-b border-base-200 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-base-200 text-base-content/80 shrink-0">
            <Tv className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="heading-h4 block text-sm truncate">
              Ruang {room_label || "-"}
            </span>
            {ward_name && (
              <span className="text-[10px] uppercase font-bold tracking-wider text-base-content/50 truncate block">
                {ward_name}
              </span>
            )}
          </div>
        </div>

        {/* Indikator Titik Online/Offline */}
        <span
          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
            online
              ? "bg-success shadow-success/50 shadow-xs"
              : "bg-error animate-pulse"
          }`}
          title={online ? "Online" : "Offline"}
        ></span>
      </div>

      {/* Bagian Detail Informasi */}
      <div className="space-y-1.5 text-xs">
        {/* Serial Number */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-caption opacity-60">Serial:</span>
          <span className="text-data text-[11px] font-mono truncate max-w-32.5 text-base-content/80">
            {serial}
          </span>
        </div>

        {/* Status STB */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-caption opacity-60">Status:</span>
          <span className="badge badge-xs badge-ghost font-mono font-medium">
            {status}
          </span>
        </div>

        {/* Last Seen / Keterangan Online/Offline */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-base-200">
          <span className="text-caption opacity-60 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Terakhir:
          </span>
          <span className="font-medium">
            {online ? (
              <span className="text-success flex items-center gap-1 text-[11px]">
                <Wifi className="w-3 h-3" /> Online
              </span>
            ) : (
              <span className="text-error flex items-center gap-1 text-[11px]">
                <WifiOff className="w-3 h-3" /> {lalu}
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
