import { BellRing, CheckCircle2, UserCheck } from "lucide-react";

interface CallItemCardProps {
  call: any;
  namaStation: string;
  loadingId: string | null;
  onAction: (callId: string, isPending: boolean) => void;
}

export const CallItemCard = ({
  call,
  namaStation,
  loadingId,
  onAction,
}: CallItemCardProps) => {
  const isPending = call.status === "PENDING";
  const sudahDijawab = call.status === "ACKNOWLEDGED";

  let infoDiambil = null;
  if (sudahDijawab) {
    const olehAnda =
      call.acked_by && namaStation && call.acked_by === namaStation;
    infoDiambil = olehAnda
      ? "Ditangani oleh Anda"
      : `Oleh: ${call.acked_by || "Perawat lain"}`;
  }

  return (
    <li
      className={`relative overflow-hidden bg-base-100 border rounded-lg p-3 flex items-center justify-between gap-3 transition-all shadow-2xs hover:shadow-xs ${
        isPending
          ? "border-warning/60 bg-warning/5 border-l-4 border-l-warning"
          : "border-success/40 bg-success/5 border-l-4 border-l-success opacity-90"
      }`}
    >
      {/* Sisi Kiri: Ikon, Jenis Call, dan Lokasi */}
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`p-2 rounded-lg shrink-0 ${
            isPending
              ? "bg-warning/15 text-warning"
              : "bg-success/15 text-success"
          }`}
        >
          {isPending ? (
            <BellRing size={16} className="animate-bounce" />
          ) : (
            <CheckCircle2 size={16} />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm tracking-tight text-base-content uppercase">
              {call.kind}
            </span>
            <span className="text-body text-base-content/70">
              •{" "}
              <strong className="text-base-content">
                {call.room_label || "?"}
              </strong>{" "}
              ({call.ward_name || "?"})
            </span>
          </div>

          {/* Info Status / Ditangani Oleh */}
          <div className="flex items-center gap-2 mt-0.5">
            {sudahDijawab && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-info bg-info/10 px-2 py-0.5 rounded-md border border-info/20">
                <UserCheck size={11} /> {infoDiambil}
              </span>
            )}
            {call.press_count > 1 && (
              <span className="text-data text-[11px] font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-md border border-warning/20">
                {call.press_count}x ditekan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Sisi Kanan: Tombol Aksi */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          className={`px-3.5 py-1.5 rounded-md font-semibold text-xs transition-all cursor-pointer border shadow-2xs ${
            isPending
              ? "bg-warning text-warning-content border-warning hover:bg-warning/90 active:scale-95"
              : "bg-base-200 text-base-content border-base-300 hover:bg-base-300 active:scale-95"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          disabled={loadingId === call.call_id}
          onClick={() => onAction(call.call_id, isPending)}
        >
          {loadingId === call.call_id
            ? "Memproses..."
            : sudahDijawab
              ? "Tutup"
              : "Jawab"}
        </button>
      </div>
    </li>
  );
};
