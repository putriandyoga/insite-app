import { useState, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import { useInstanceMyDepartment } from "../../hooks/instances/use-instances-my-departement";
import { useInstancesDetail } from "@patient-verification/hooks/instances/use-instances-detail";
import {
  Search,
  UserCheck,
  Building2,
  Clock,
  CheckCircle2,
} from "lucide-react";

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0 overflow-hidden">
          {/* KOLOM KIRI: DAFTAR INSTANCE (1/4 atau 4 kolom) */}
          <div className="lg:col-span-4 flex flex-col h-full min-h-0">
            <Card className="flex flex-col h-full p-4 shadow-md border border-base-300 bg-base-100 overflow-hidden gap-3">
              <div className="flex items-center justify-between border-b border-base-200 pb-3 shrink-0">
                <span className="font-bold text-xs uppercase tracking-wider text-base-content/70">
                  Daftar Instance Pasien
                </span>
                <span className="badge badge-primary badge-sm font-bold">
                  {filteredData.length}
                </span>
              </div>

              <div className="relative shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" />
                <input
                  type="text"
                  placeholder="Cari nama pasien / RM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered input-sm w-full pl-9 text-xs"
                />
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
                {loadingList ? (
                  <div className="flex justify-center items-center py-10 text-xs text-base-content/50">
                    Memuat data...
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="text-center py-10 text-xs text-base-content/50 italic">
                    Tidak ada data pasien ditemukan.
                  </div>
                ) : (
                  filteredData.map((item: any) => {
                    const isSelected = selectedId === item.id;
                    const pasienName =
                      item.context_data?.name ||
                      item.ticket_code ||
                      "Tanpa Nama";
                    const rm = item.context_data?.medical_record || "-";
                    const unit =
                      item.context_data?.unit || item.process?.name || "-";
                    const progress = item.progress_percentage || 0;

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-xs"
                            : "border-base-200 bg-base-100 hover:border-base-300 hover:bg-base-200/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-sm text-base-content truncate">
                            {pasienName}
                          </span>
                          <span className="text-[11px] font-mono text-base-content/60 shrink-0">
                            RM: {rm}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-base-content/70">
                          <Building2 className="w-3.5 h-3.5 opacity-60 shrink-0" />
                          <span className="truncate">{unit}</span>
                        </div>

                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] text-base-content/60 font-medium">
                            <span>Progress</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-base-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>

          {/* KOLOM KANAN: DETAIL & TIMELINE (3/4 atau 8 kolom) */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-0">
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
                <div className="flex flex-col h-full min-h-0 gap-5 overflow-y-auto pr-2">
                  {/* Header Detail */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-base-200 pb-4 shrink-0">
                    <div>
                      <h2 className="text-xl font-bold text-base-content">
                        {selectedInstance.context_data?.name ||
                          selectedInstance.ticket_code}
                      </h2>
                      <div className="text-xs text-base-content/60 flex items-center gap-3 mt-1">
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
                    <span className="badge badge-primary font-semibold px-3 py-2 text-xs uppercase">
                      {selectedInstance.status}
                    </span>
                  </div>

                  {/* Banner Info Tahapan Saat Ini */}
                  {selectedInstance.current_stage && (
                    <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/30 text-warning-content flex items-center gap-3 shrink-0 shadow-2xs">
                      <Clock className="w-5 h-5 text-warning shrink-0" />
                      <span className="text-xs font-medium text-base-content/90">
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

                  {/* Timeline Tahapan Proses */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-base-content/80 tracking-wide uppercase">
                      Timeline Tahapan Proses ({selectedInstance.process?.name})
                    </h3>

                    <div className="space-y-2.5">
                      {selectedInstance.stages_timeline?.map((stage, idx) => {
                        const isCompleted = stage.status === "completed";
                        const isCurrent = stage.status === "current";

                        return (
                          <div
                            key={idx}
                            className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                              isCompleted
                                ? "border-success/30 bg-success/5"
                                : isCurrent
                                  ? "border-primary/40 bg-primary/5"
                                  : "border-base-300 bg-base-100 opacity-75"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-sm text-base-content flex items-center gap-2">
                                <span>
                                  #{stage.stage_order} - {stage.stage_name}
                                </span>
                              </div>
                              <p className="text-xs text-base-content/60">
                                Bagian:{" "}
                                {stage.departments
                                  ?.map(
                                    (d) =>
                                      `${d.name} (${d.is_mandatory ? "Mandatori" : "Opsional"})`,
                                  )
                                  .join(", ")}
                              </p>
                              {isCompleted && stage.first_verified_at && (
                                <p className="text-[11px] text-success font-medium flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />{" "}
                                  Diverifikasi • {stage.verified_count}x
                                  verifikasi
                                </p>
                              )}
                            </div>

                            <span
                              className={`badge badge-sm font-semibold ${
                                isCompleted
                                  ? "badge-success text-white"
                                  : isCurrent
                                    ? "badge-primary"
                                    : "badge-ghost"
                              }`}
                            >
                              {stage.status.toUpperCase()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageMiddle>
    </div>
  );
};

export default DashboardPage;
