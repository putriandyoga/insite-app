import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { StageTimelineItem } from "@patient-verification/types/instancesTypes";
import { getInstanceStatusInfo } from "@patient-verification/constants/instancesStatusMap";
import { formatDateTimeNumeric } from "@/utils/dateFormater";

interface InstanceTimelineProps {
  timeline: StageTimelineItem[];
  processName?: string;
}

export const InstanceTimeline: React.FC<InstanceTimelineProps> = ({
  timeline,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-base-content/80 tracking-wide uppercase">
        Timeline Tahapan Proses
      </h3>

      <div className="space-y-2.5">
        {timeline?.map((stage, idx) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          // Ambil informasi warna & label otomatis dari getInstanceStatusInfo
          const statusInfo = getInstanceStatusInfo(stage.status);

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                isCompleted
                  ? "border-success/30 bg-success/5"
                  : isCurrent
                    ? "border-primary/40 bg-primary/5 shadow-xs"
                    : "border-base-300 bg-base-100 opacity-75"
              }`}
            >
              <div className="space-y-1">
                <div className="font-bold text-sm text-base-content flex items-center gap-2">
                  <span>
                    {stage.stage_order}. {stage.stage_name}
                  </span>
                  {isCompleted && stage.first_verified_at && (
                    <p className="text-body text-success font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Diverifikasi{" "}
                      {formatDateTimeNumeric(stage.first_verified_at)}
                      {/* •{" "}
                      {stage.verified_count}x verifikasi */}
                    </p>
                  )}
                </div>
                <p className="text-body text-base-content/60">
                  Unit verifikator:{" "}
                  {stage.departments?.map((d) => `${d.name}`).join(", ")}
                </p>
              </div>

              {/* Menggunakan styling & label langsung dari getInstanceStatusInfo */}
              <span
                className={`badge badge-sm font-semibold px-3 py-2 ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
