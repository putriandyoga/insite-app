import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import { useInstanceMyDepartment } from "@patient-verification/hooks/instances/use-instances-my-departement";
import { useInstancesDetail } from "@patient-verification/hooks/instances/use-instances-detail";
import { UserCheck, Clock, Search } from "lucide-react";
import { getInstanceStatusInfo } from "@patient-verification/constants/instancesStatusMap";
import { InstanceTimeline } from "@patient-verification/components/InstanceTimeline";
import { InstanceCardItem } from "@patient-verification/components/InstanceCardItem";
import FormInput from "@/components/FormInput";
import { DetailRowItem } from "@/components/DetailRowItem";
import { formatDateIndo, formatTime } from "@/utils/dateFormater";

const DashboardPage = () => {
  const { data: listData, loading: loadingList } = useInstanceMyDepartment();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    undefined,
  );

  const { data: selectedInstance, loading: loadingDetail } = useInstancesDetail(
    selectedId ? String(selectedId) : undefined,
  );

  const filteredData = useMemo(() => {
    if (!listData) return [];
    return listData.filter((item: any) => {
      const query = searchQuery.toLowerCase();
      const name = (
        item.context_data?.name ||
        item.ticket_code ||
        ""
      ).toLowerCase();
      const rm = (item.context_data?.medical_record || "").toLowerCase();
      return name.includes(query) || rm.includes(query);
    });
  }, [listData, searchQuery]);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden bg-base-100/50">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[{ label: "Home", path: "/" }, { label: "Dashboard" }]}
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 h-full min-h-0 overflow-hidden">
          {/* KOLOM KIRI: DAFTAR INSTANCE (4 Kolom) */}
          <div className="col-span-1 lg:col-span-2 flex flex-col h-full min-h-0">
            <Card className="flex flex-col h-full overflow-hidden gap-2">
              <div className="flex items-center justify-between border-b border-base-300 pb-2 shrink-0">
                <span className="font-bold text-body uppercase tracking-wider text-base-content/70">
                  Daftar Instance Pasien
                </span>
                <span className="badge badge-primary badge-sm font-bold">
                  {filteredData.length}
                </span>
              </div>
              <FormInput
                placeholder="Cari nama pasien / RM"
                value={searchQuery}
                onChange={setSearchQuery}
                label=""
                icon={Search}
              />
              <div className="flex-1 overflow-y-auto space-y-2.5">
                {loadingList ? (
                  <div className="flex justify-center items-center py-10 text-body text-base-content/50">
                    Memuat data...
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-10 text-body text-base-content/50 italic">
                    Tidak ada data pasien ditemukan.
                  </div>
                ) : (
                  filteredData.map((item: any) => (
                    <InstanceCardItem
                      key={item.id}
                      item={item}
                      isSelected={selectedId === item.id}
                      onSelect={(id) => setSelectedId(id)}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN: DETAIL & TIMELINE (8 Kolom) */}
          <div className="col-span-3 lg:col-span-6 flex flex-col h-full min-h-0">
            <Card className="flex flex-col h-full p-6 shadow-md border border-base-300 bg-base-100 overflow-hidden">
              {!selectedId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4 shadow-sm">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content">
                    Belum Ada Pasien Dipilih
                  </h3>
                  <p className="text-sm text-base-content/60 max-w-md mt-1 leading-relaxed">
                    Silakan pilih salah satu pasien dari daftar di sebelah kiri
                    untuk melihat detail informasi dan melakukan verifikasi
                    layanan.
                  </p>
                </div>
              ) : loadingDetail ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-base-content/60 text-sm">
                  <span className="loading loading-spinner loading-md text-primary mb-2"></span>
                  Memuat detail informasi pasien...
                </div>
              ) : !selectedInstance ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-error text-sm">
                  Gagal memuat data detail instance pasien.
                </div>
              ) : (
                <>
                  {/* Header Detail & Status Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-200 pb-4 shrink-0">
                    <div>
                      <h2 className="text-xl font-bold text-base-content">
                        {selectedInstance.context_data?.name ||
                          selectedInstance.ticket_code}
                      </h2>
                      <div className="text-body text-base-content/60 flex items-center gap-3 mt-1">
                        <span>
                          RM:{" "}
                          <strong className="font-mono">
                            {selectedInstance.context_data?.medical_record ||
                              "-"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Unit:{" "}
                          <strong className="font-medium">
                            {selectedInstance.context_data?.unit || "-"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Penjamin:{" "}
                          <strong className="font-medium">
                            {selectedInstance.context_data?.insurance || "-"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Menggunakan helper getInstanceStatusInfo */}
                    {(() => {
                      const statusInfo = getInstanceStatusInfo(
                        selectedInstance.status,
                      );
                      return (
                        <span
                          className={`badge px-3 py-2  ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex flex-col h-full min-h-0 gap-5 overflow-y-auto pr-2">
                    {/* Banner Info Tahapan Saat Ini */}
                    {selectedInstance.current_stage && (
                      <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/30 text-warning-content flex items-center gap-3 shrink-0 shadow-2xs">
                        <Clock className="w-5 h-5 text-warning shrink-0" />
                        <span className="text-body font-medium text-base-content/90">
                          Menunggu verifikasi tahap #
                          {selectedInstance.current_stage.stage_order} —{" "}
                          <strong>
                            {selectedInstance.current_stage.stage_name}
                          </strong>{" "}
                          (
                          {selectedInstance.current_stage.departments
                            ?.map((d) => d.name)
                            .join(", ")}
                          )
                        </span>
                      </div>
                    )}

                    {/* Komponen Timeline Terpisah */}
                    <InstanceTimeline
                      timeline={selectedInstance.stages_timeline || []}
                      processName={selectedInstance.process?.name}
                    />
                  </div>
                  <div className="flex flex-col gap-4 mt-4 border-t-2 border-base-300">
                    <div className="divide-y divide-base-300/70">
                      {/* 1. Nama Template */}
                      <DetailRowItem label="Nama Proses">
                        <span>{selectedInstance.process?.name}</span>
                      </DetailRowItem>
                      <DetailRowItem label="Template Digunakan">
                        <span>{selectedInstance.context_template?.name}</span>
                      </DetailRowItem>
                      <DetailRowItem label="Total Durasi">
                        <span>
                          {selectedInstance.total_duration_minutes} Menit
                        </span>
                      </DetailRowItem>
                      <DetailRowItem label="Dimulai Sejak">
                        <span>
                          {formatDateIndo(selectedInstance.started_at)} -{" "}
                          {formatTime(selectedInstance.started_at)}
                        </span>
                      </DetailRowItem>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </PageMiddle>
    </div>
  );
};

export default DashboardPage;
