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
  const isLoading = loadingId === call.call_id;

  const olehAnda =
    sudahDijawab &&
    call.acked_by &&
    namaStation &&
    call.acked_by === namaStation;

  const infoDiambil = olehAnda
    ? "Ditangani oleh Anda"
    : `Oleh: ${call.acked_by || "Perawat lain"}`;

  return (
    <li className="flex items-center justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-4 transition-colors hover:bg-base-200/40">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
            isPending
              ? "border-warning/30 bg-warning/10 text-warning"
              : "border-base-300 bg-base-200 text-base-content/70"
          }`}
        >
          {isPending ? (
            <BellRing size={19} strokeWidth={1.8} />
          ) : (
            <CheckCircle2 size={19} strokeWidth={1.8} />
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-base-content">
              {call.kind || "NURSE"}
            </span>

            <span className="text-base-content/40">|</span>

            <span className="text-sm font-medium text-base-content">
              Ruang {call.room_label || "—"}
            </span>

            <span className="text-sm text-base-content/60">
              {call.ward_name || "—"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                isPending
                  ? "border-warning/30 bg-warning/10 text-warning"
                  : "border-success/30 bg-success/10 text-success"
              }`}
            >
              {isPending ? "Menunggu respons" : "Sudah dijawab"}
            </span>

            {sudahDijawab && (
              <span className="inline-flex items-center gap-1 text-xs text-base-content/60">
                <UserCheck size={13} />
                {infoDiambil}
              </span>
            )}

            {call.press_count > 1 && (
              <span className="text-xs text-base-content/60">
                Ditekan {call.press_count} kali
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        type="button"
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
          isPending
            ? "border-base-300 bg-base-100 text-base-content hover:bg-base-200"
            : "border-base-300 bg-base-200 text-base-content hover:bg-base-300"
        }`}
        disabled={isLoading}
        onClick={() => onAction(call.call_id, isPending)}
      >
        {isLoading ? "Memproses..." : sudahDijawab ? "Tutup" : "Jawab"}
      </button>
    </li>
  );
};
