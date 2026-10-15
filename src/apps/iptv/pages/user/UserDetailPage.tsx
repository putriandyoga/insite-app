import Breadcrumb from "@/components/Breadcrumb";
import DataSection from "@/components/DataSection";

import { Activity, Bed, Pencil, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useUserDetail } from "@iptv/hooks/user/use-user-detail";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import { formatDateIndoWithTime, formatTimeAgo } from "@/utils/dateFormater";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import FormSection from "@/components/FormSection";
import { capitalizeEachWord } from "@/utils/capitalizer";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const { data, loading, error } = useUserDetail(userId);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "User", path: "/app/iptv/user" },
                { label: capitalizeEachWord(data?.username) || "Detail user" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to={`/app/iptv/user/${userId}/edit`}
              icon={Pencil}
              color="warning"
              label="Edit Data"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative md:overflow-auto gap-4">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data User"
            />

            {!loading && !error && data && (
              <>
                <div className="flex flex-row gap-4 border-b border-base-300 pb-2">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/40 text-base-content">
                    <User className="h-8 w-8" />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <h1 className="wrap-break-word text-xl font-bold tracking-tight text-base-content sm:text-2xl">
                      {data.username}
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

                      <span className="hidden text-base-content/30 sm:inline">
                        |
                      </span>

                      <p className="min-w-0 text-sm text-base-content/60">
                        <span className="font-medium text-base-content/80">
                          Role:
                        </span>{" "}
                        {capitalizeEachWord(data.role) || "-"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <FormSection
                    title="Station & Ward"
                    icon={Bed}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">
                          Nama Station
                        </div>
                        <dd className="text-sm font-semibold text-base-content sm:text-right">
                          {data.station?.name || "-"}
                        </dd>
                      </div>

                      <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                        <div className="text-sm text-base-content/60">Ward</div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.station?.ward_name || "-"}
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Riwayat & Keamanan"
                    icon={Activity}
                    color="primary"
                  >
                    <div className="divide-y divide-base-300/70">
                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Login Terakhir
                        </div>
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
                        <div className="text-sm text-base-content/60">
                          Password Diubah
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.password_changed_at
                            ? formatDateIndoWithTime(data.password_changed_at)
                            : "-"}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Akun Dibuat
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.created_at
                            ? formatDateIndoWithTime(data.created_at)
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </FormSection>
                </div>
              </>
            )}
          </div>
        </Card>
      </PageMiddle>
    </div>
  );
}
