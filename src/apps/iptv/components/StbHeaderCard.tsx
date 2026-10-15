import { Tv } from "lucide-react";
import Card from "@/components/Card";

interface StbHeaderCardProps {
  data: {
    serial: string;
    status: string;
    online: boolean;
    note?: string;
    app_version?: string;
    os_version?: string;
    last_ip?: string;
  };
}

export const StbHeaderCard = ({ data }: StbHeaderCardProps) => {
  const statusClass =
    data.status === "ENROLLED" || data.status === "ACTIVE"
      ? "badge-primary"
      : data.status === "RETIRED"
        ? "badge-warning"
        : "badge-neutral";

  return (
    <Card>
      <div className="flex flex-col gap-5  lg:flex-row lg:items-center lg:justify-between">
        {/* Informasi utama perangkat */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-base-content">
            <Tv className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="heading-h3 break-all font-bold text-base-content">
                {data.serial}
              </h2>

              <span className={`badge badge-sm ${statusClass} font-semibold`}>
                {data.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    data.online ? "bg-success" : "bg-error"
                  }`}
                />
                <span className={data.online ? "text-success" : "text-error"}>
                  {data.online ? "Online" : "Offline"}
                </span>
              </span>

              <span className="hidden text-base-content/30 sm:inline">|</span>

              <p className="min-w-0 text-sm text-base-content/60">
                <span className="font-medium text-base-content/80">
                  Catatan:
                </span>{" "}
                {data.note || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Informasi teknis */}
        <div className="grid grid-cols-1 gap-3 border-t border-base-300 pt-4 sm:grid-cols-3 lg:w-auto lg:min-w-120 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="min-w-0">
            <p className="text-xs text-base-content/60">App Version</p>
            <p className="mt-1 truncate font-mono text-sm font-semibold text-base-content">
              {data.app_version || "-"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-base-content/60">OS Version</p>
            <p className="mt-1 truncate font-mono text-sm font-semibold text-base-content">
              {data.os_version || "-"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-base-content/60">IP Terakhir</p>
            <p className="mt-1 break-all font-mono text-sm font-semibold text-base-content">
              {data.last_ip || "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
