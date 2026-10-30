import { History, ArrowRight } from "lucide-react";
import { formatDateTimeNumeric } from "@/utils/dateFormater";
import { capitalizeEachWord, toAllUppercase } from "@/utils/capitalizer";

interface ContextLogDetailItem {
  id: number;
  changed_at: string;
  changed_by_name: string;
  change_reason: string;
  changed_fields: string[];
  old_data?: Record<string, any>;
  new_data?: Record<string, any>;
}

interface InstanceContextLogsCardProps {
  logs: ContextLogDetailItem[];
  withHeader?: boolean;
}

export function InstanceContextLogsCard({
  logs = [],
  withHeader = false,
}: InstanceContextLogsCardProps) {
  return (
    <div className="space-y-3">
      {withHeader && (
        <h3 className="text-body font-bold text-base-content/80 tracking-wide uppercase flex items-center gap-2">
          <History className="w-4 h-4 text-base-content/70" />
          Riwayat Perubahan Data
        </h3>
      )}

      {logs.length === 0 ? (
        <div className="p-4 rounded-xl border border-base-300 bg-base-200/50 text-center text-body text-base-content/50 italic">
          Belum ada perubahan data context yang tercatat.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl border border-base-300 bg-base-200/60 flex flex-col gap-2.5 text-body shadow-2xs"
            >
              {/* Header Card */}
              <div className="flex items-center justify-between border-b border-base-300 pb-2">
                <span className="font-semibold text-base-content">
                  Diubah oleh:{" "}
                  <strong className="text-base-content font-bold">
                    {toAllUppercase(log.changed_by_name)}
                  </strong>
                </span>
                <span className="text-base-content/60 text-caption">
                  {formatDateTimeNumeric(log.changed_at)}
                </span>
              </div>

              {/* Alasan Perubahan */}
              <div>
                <span className="text-base-content/60 font-medium">
                  Alasan Perubahan:
                </span>
                <p className="text-base-content/80 font-medium italic mt-0.5">
                  "{log.change_reason}"
                </p>
              </div>

              {/* Detail Perbandingan Old Data vs New Data */}
              <div className="space-y-1.5 pt-1">
                <span className="text-base-content/60 font-medium">
                  Detail Perubahan:
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {log.changed_fields.map((field) => {
                    const oldValue = log.old_data?.[field] ?? "-";
                    const newValue = log.new_data?.[field] ?? "-";

                    return (
                      <div
                        key={field}
                        className="flex flex-col sm:flex-row sm:items-center justify-between bg-base-100 p-2.5 rounded-lg border border-base-300 gap-2"
                      >
                        <span className="font-mono font-semibold text-base-content/70 uppercase text-caption tracking-wider">
                          {capitalizeEachWord(field)}
                        </span>
                        <div className="flex items-center gap-2 text-base-content/80 flex-wrap">
                          <span className="line-through text-base-content/50 bg-base-200 px-2 py-0.5 rounded text-caption">
                            {String(oldValue)}
                          </span>
                          <ArrowRight className="w-3 h-3 text-base-content/40 shrink-0" />
                          <span className="text-base-content font-medium bg-base-300/60 px-2 py-0.5 rounded text-caption">
                            {String(newValue)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
