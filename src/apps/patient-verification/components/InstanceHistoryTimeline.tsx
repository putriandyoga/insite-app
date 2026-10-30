import { CheckCircle2, Clock } from "lucide-react";
import { formatDateTimeNumeric } from "@/utils/dateFormater";

interface RecordItem {
  id: number;
  staff_name: string;
  departemen_name: string;
  verified_at: string;
  notes: string | null;
}

interface StageHistoryItem {
  stage_order: number;
  stage_name: string;
  status?: string;
  records: RecordItem[];
  departments?: Array<{ name: string }>;
}

interface InstanceHistoryTimelineProps {
  stages: StageHistoryItem[];
  withHeader?: boolean;
}

export function InstanceHistoryTimeline({
  stages,
  withHeader = false,
}: InstanceHistoryTimelineProps) {
  return (
    <div className="space-y-4">
      {withHeader && (
        <h3 className="text-body font-bold text-base-content/80 tracking-wide uppercase">
          Riwayat Verifikasi
        </h3>
      )}

      <div className="space-y-2.5">
        {stages?.map((stage, idx) => {
          const hasRecords = stage.records && stage.records.length > 0;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                hasRecords
                  ? "border-success/30 bg-success/5"
                  : "border-base-300 bg-base-100 opacity-75"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="font-bold text-body text-base-content flex items-center gap-2">
                  <span>
                    {stage.stage_order}. {stage.stage_name}
                  </span>
                </div>

                <span
                  className={`badge badge-sm font-semibold px-3 py-2 ${
                    hasRecords
                      ? "bg-success/20 border border-success/30 text-base-content/80"
                      : "bg-ghost border border-base-300 text-base-content/80"
                  }`}
                >
                  {hasRecords ? "Selesai" : "Menunggu"}
                </span>
              </div>

              {/* Render Record/Staff yang memverifikasi */}
              {hasRecords ? (
                <div className="space-y-2 pt-2 border-t border-success/20">
                  {stage.records.map((rec) => (
                    <div
                      key={rec.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 bg-base-100/80 p-2.5 rounded-lg border border-success/10"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <div>
                          <strong className="text-base-content">
                            {rec.staff_name}
                          </strong>
                          <span className="text-base-content/60 ml-1.5">
                            ({rec.departemen_name})
                          </span>
                        </div>
                      </div>
                      <div className="text-base-content/60 flex items-center gap-1 pl-6 sm:pl-0">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTimeNumeric(rec.verified_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-base-content/50 italic">
                  Belum ada catatan verifikasi pada tahap ini.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
