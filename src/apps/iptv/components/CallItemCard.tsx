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
      : `Ditangani oleh ${call.acked_by || "perawat lain"}`;
  }

  return (
    <li
      className={`bg-base-100 border border-base-300 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm transition-all hover:border-base-content/20 ${
        isPending
          ? "border-l-4 border-l-warning bg-warning/5"
          : "border-l-4 border-l-success opacity-85"
      }`}
    >
      <div className="flex items-center gap-3 flex-wrap min-w-0">
        <h3 className="heading-h3 text-base-content">{call.kind}</h3>
        <span className="text-body text-base-content/70">
          •{" "}
          <span className="font-semibold text-base-content">
            {call.room_label || "?"}
          </span>{" "}
          ({call.ward_name || "?"})
        </span>

        {sudahDijawab && (
          <span className="text-error text-caption font-semibold px-3 py-1 rounded-full bg-error/10 border border-error/20">
            {infoDiambil}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {call.press_count > 1 && (
          <span className="text-data px-2.5 py-1 rounded-md bg-base-200 text-warning border border-base-300">
            {call.press_count}x ditekan
          </span>
        )}

        <button
          className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all cursor-pointer border shadow-sm ${
            isPending
              ? "bg-warning text-warning-content border-warning hover:bg-warning/90"
              : "bg-base-200 text-base-content border-base-300 hover:bg-base-300"
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
