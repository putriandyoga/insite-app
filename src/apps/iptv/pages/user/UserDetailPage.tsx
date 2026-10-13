import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Activity, MapPin, Pencil, ShieldCheck, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useUserDetail } from "@iptv/hooks/user/use-user-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { formatDateIndoWithTime, formatTimeAgo } from "@/utils/dateFormater";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading, error } = useUserDetail(userId);
  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
        <div className="overflow-x-auto min-w-0">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Dashboard", path: "/app/iptv/dashboard" },
              { label: "User", path: "/app/iptv/user" },
              { label: data?.username || "Detail User" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ActionButton
            to={`/app/iptv/user//${userId}/edit`}
            icon={Pencil}
            label="Edit User"
            color="warning"
          />
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="w-full overflow-x-auto">
          <DataSection
            loading={loading}
            error={error}
            data={data}
            emptyMessage="User tidak ditemukan"
          />
          {data && (
            <div className="flex flex-col gap-6">
              {/* Profile Header */}
              <section className="flex flex-col gap-5 border-b border-base-300 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <User className="h-8 w-8" strokeWidth={1.75} />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                        {data.username}
                      </h1>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                          data.status === "ACTIVE"
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-error/30 bg-error/10 text-error"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            data.status === "ACTIVE" ? "bg-success" : "bg-error"
                          }`}
                        />
                        {data.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <p className="text-sm text-base-content/60">
                      Role{" "}
                      <span className="font-medium text-base-content/80">
                        {data.role}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start rounded-lg border border-base-300 bg-base-200/50 px-3 py-2 sm:self-center">
                  <ShieldCheck className="h-4 w-4 text-base-content/60" />
                  <span className="text-xs font-medium text-base-content/70">
                    Informasi Akun
                  </span>
                </div>
              </section>

              {/* Account Details */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Station Information */}
                <section className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
                  <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-base-content">
                        Station & Ward
                      </h2>
                      <p className="mt-0.5 text-xs text-base-content/55">
                        Informasi penempatan akun
                      </p>
                    </div>
                  </div>

                  <dl className="divide-y divide-base-300/70 px-5">
                    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <dt className="text-sm text-base-content/60">
                        Nama Station
                      </dt>
                      <dd className="text-sm font-semibold text-base-content sm:text-right">
                        {data.station?.name || "-"}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <dt className="text-sm text-base-content/60">Ward</dt>
                      <dd className="text-sm font-medium text-base-content sm:text-right">
                        {data.station?.ward_name || "-"}
                      </dd>
                    </div>
                  </dl>
                </section>

                {/* Activity & Security */}
                <section className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
                  <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Activity className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-base-content">
                        Aktivitas & Keamanan
                      </h2>
                      <p className="mt-0.5 text-xs text-base-content/55">
                        Riwayat aktivitas dan informasi keamanan
                      </p>
                    </div>
                  </div>

                  <dl className="divide-y divide-base-300/70 px-5">
                    <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-sm text-base-content/60">
                        Login Terakhir
                      </dt>
                      <dd className="text-sm font-medium text-base-content sm:text-right">
                        {data.last_login_at ? (
                          <>
                            <span>
                              {formatDateIndoWithTime(data.last_login_at)}
                            </span>
                            <span className="mt-1 block text-xs font-normal text-base-content/55">
                              {formatTimeAgo(data.last_login_at)}
                            </span>
                          </>
                        ) : (
                          <span className="font-normal text-base-content/55">
                            Belum pernah login
                          </span>
                        )}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-sm text-base-content/60">
                        Password Diubah
                      </dt>
                      <dd className="text-sm font-medium text-base-content sm:text-right">
                        {data.password_changed_at
                          ? formatDateIndoWithTime(data.password_changed_at)
                          : "-"}
                      </dd>
                    </div>

                    <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <dt className="text-sm text-base-content/60">
                        Akun Dibuat
                      </dt>
                      <dd className="text-sm font-medium text-base-content sm:text-right">
                        {data.created_at
                          ? formatDateIndoWithTime(data.created_at)
                          : "-"}
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
