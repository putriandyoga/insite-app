import { useParams } from "react-router-dom";
import { Link2, Cpu, AlertCircle } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import FormSection from "@/components/FormSection";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import { useStbDetail } from "@iptv/hooks/stb/use-stb-detail";
import { formatDateIndoWithTime, formatTimeAgo } from "@/utils/dateFormater";
import DataSection from "@/components/DataSection";
import { StbHeaderCard } from "@iptv/components/StbHeaderCard";
import ActionButton from "@/components/ActionButton";

const StbDetailPage = () => {
  const { stbId } = useParams<{ stbId: string }>();
  const { data, loading, error } = useStbDetail(stbId);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "STB", path: "/app/iptv/stb" },
                { label: data?.serial || "Detail STB" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9"></div>
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
                <StbHeaderCard data={data} />
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {" "}
                  <FormSection title="Detail Sistem" icon={Cpu} color="primary">
                    <div className="divide-y divide-base-300/70">
                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Sumber Serial
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.serial_source}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Tanggal Dibuat
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {formatDateIndoWithTime(data.created_at)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Terakhir Aktif
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.last_seen_at ? (
                            <>
                              <span>
                                {formatDateIndoWithTime(data.last_seen_at)}
                              </span>
                              <span className="mt-1 block text-xs font-normal text-base-content/55">
                                {formatTimeAgo(data.last_seen_at)}
                              </span>
                            </>
                          ) : (
                            <span className="font-normal text-base-content/55">
                              Belum pernah login
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Tanggal Revoked
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.revoked_at ? (
                            <>
                              <span>
                                {formatDateIndoWithTime(data.revoked_at)}
                              </span>
                              <span className="mt-1 block text-xs font-normal text-base-content/55">
                                {formatTimeAgo(data.revoked_at)}
                              </span>
                            </>
                          ) : (
                            <span className="font-normal text-base-content/55">
                              -
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-base-content/60">
                          Tanggal Retired
                        </div>
                        <div className="text-sm font-medium text-base-content sm:text-right">
                          {data.retired_at ? (
                            <>
                              <span>
                                {formatDateIndoWithTime(data.retired_at)}
                              </span>
                              <span className="mt-1 block text-xs font-normal text-base-content/55">
                                {formatTimeAgo(data.retired_at)}
                              </span>
                            </>
                          ) : (
                            <span className="font-normal text-base-content/55">
                              -
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormSection>
                  <FormSection
                    title="Informasi Penempatan"
                    icon={Link2}
                    color="primary"
                  >
                    {data.binding ? (
                      <div className="divide-y divide-base-300/70">
                        <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-base-content/60">
                            Unit
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {data.binding.ward_name}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-base-content/60">
                            Ruangan
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {data.binding.room_label}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-sm text-base-content/60">
                            Bed
                          </div>
                          <div className="text-sm font-medium text-base-content sm:text-right">
                            {data.binding.bed_label}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border border-dashed border-base-300 rounded-2xl bg-base-200/20">
                        <div className="flex items-center gap-3 text-base-content/70">
                          <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                          <span className="text-sm">
                            STB ini belum diikat (bind) ke Bed manapun di rumah
                            sakit.
                          </span>
                        </div>
                        <ActionButton
                          to={`/app/iptv/stb/${stbId}/bind`}
                          icon={Link2}
                          color="info"
                          label="Ikat ke Bed Sekarang"
                        />
                      </div>
                    )}
                  </FormSection>
                </div>
              </>
            )}
          </div>
        </Card>
      </PageMiddle>
    </div>
  );
};

export default StbDetailPage;
