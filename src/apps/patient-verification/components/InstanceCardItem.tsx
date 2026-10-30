import { CheckCircle2 } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";

interface InstanceCardItemProps {
  item: any;
  isSelected: boolean;
  onSelect: (id: string | number) => void;
}

export function InstanceCardItem({
  item,
  isSelected,
  onSelect,
}: InstanceCardItemProps) {
  const pasienName =
    item.context_data?.name || item.ticket_code || "Tanpa Nama";
  const rm = item.context_data?.medical_record || "-";

  const progress = Math.min(
    100,
    Math.max(0, Number(item.progress_percentage) || 0),
  );

  return (
    <div
      onClick={() => onSelect(item.id)}
      className={`
        group relative flex cursor-pointer flex-col gap-2.5 overflow-hidden
        rounded-xl border p-3 transition-all duration-200
        ${
          isSelected
            ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/20"
            : "border-base-300 bg-base-100 hover:border-primary/50 hover:shadow-2xs"
        }
      `}
    >
      {/* Indikator garis aktif di sisi kiri */}
      {isSelected && (
        <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" />
      )}

      {/* Header: Nama Pasien & Status Selesai */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h4
            className="text-body truncate font-semibold leading-snug"
            title={pasienName}
          >
            {pasienName}
          </h4>
        </div>

        {progress === 100 && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold text-success">
            <CheckCircle2 className="h-2.5 w-2.5" />
            Selesai
          </span>
        )}
      </div>

      {/* Baris Rekam Medis (Compact with CopyButton) */}
      <div className="flex items-center justify-between gap-2 rounded-lg border border-base-300/50 bg-base-200/40 px-2.5 py-1.5">
        <div className="min-w-0 flex items-center gap-1.5">
          <span className="text-caption text-base-content/50">RM:</span>
          <span className="truncate text-caption text-base-content">{rm}</span>
        </div>
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          <CopyButton text={rm} iconOnly />
        </div>
      </div>

      {progress < 100 && (
        <div className="border-t border-base-300/50 pt-2 mt-0.5">
          <div className="mb-1 flex items-center justify-between gap-2 text-caption">
            <span className="text-base-content/60">Progress</span>
            <span className="font-bold tabular-nums text-base-content">
              {progress}%
            </span>
          </div>

          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-base-200"
            role="progressbar"
            aria-label={`Progress pelayanan ${pasienName}`}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`
              h-full rounded-full transition-all duration-300
              ${progress === 100 ? "bg-success" : "bg-primary"}
              `}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
