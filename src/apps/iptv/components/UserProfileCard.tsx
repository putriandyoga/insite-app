import { User } from "lucide-react";
import Card from "@/components/Card";
import { capitalizeEachWord } from "@/utils/capitalizer";

interface UserProfileCardProps {
  data: {
    username?: string;
    status?: string;
    role?: string;
    station?: {
      name?: string;
      ward_name?: string;
    } | null;
    last_login_at?: string | null;
    password_changed_at?: string | null;
    created_at?: string | null;
  };
}

export const UserProfileCard = ({ data }: UserProfileCardProps) => {
  return (
    <Card>
      <div className="flex flex-col gap-5  lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-base-content">
            <User className="h-6 w-6" />
          </div>

          <div className="min-w-0 space-y-1.5">
            <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
              {data.username || "-"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    data.status === "ACTIVE" ? "bg-success" : "bg-error"
                  }`}
                />
                <span
                  className={
                    data.status === "ACTIVE"
                      ? "text-success font-medium"
                      : "text-error font-medium"
                  }
                >
                  {data.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                </span>
              </span>

              <span className="hidden text-base-content/30 sm:inline">|</span>

              <p className="min-w-0 text-sm text-base-content/60">
                <span className="font-medium text-base-content/80">Role:</span>{" "}
                {capitalizeEachWord(data.role) || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-base-300 pt-4 sm:grid-cols-2 lg:w-auto lg:min-w-120 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="min-w-0">
            <p className="text-xs text-base-content/60">Station</p>
            <p className="mt-1 truncate font-mono text-sm font-semibold text-base-content">
              {data.station?.name || "-"}
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-xs text-base-content/60">Ward</p>
            <p className="mt-1 truncate font-mono text-sm font-semibold text-base-content">
              {data.station?.ward_name || "-"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
