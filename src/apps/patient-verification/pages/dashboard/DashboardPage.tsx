import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import {
  UserCheck,
  Clock,
  Search,
  CheckCircle2,
  Check,
  PlusCircle,
} from "lucide-react";
import { getInstanceStatusInfo } from "@patient-verification/constants/instancesStatusMap";
import { InstanceTimeline } from "@patient-verification/components/InstanceTimeline";
import { InstanceCardItem } from "@patient-verification/components/InstanceCardItem";
import FormInput from "@/components/FormInput";
import { DetailRowItem } from "@/components/DetailRowItem";
import { formatDateIndo, formatTime } from "@/utils/dateFormater";
import ActionButton from "@/components/ActionButton";
import { useInstanceVerificationDashboard } from "@patient-verification/hooks/instances/use-instance-verification-dashboard";
import { useInstanceVerifyFirst } from "@patient-verification/hooks/instances/use-instances-verify-first";
import { useMemo, useState } from "react";
import { useProcessAll } from "@patient-verification/hooks/process/use-process-all";

const DashboardPage = () => {
  const {
    loadingInstance,
    dataStaff,
    loadingStaff,
    searchQuery,
    setSearchQuery,
    selectedId,
    selectedStaffId,
    setSelectedStaffId,
    selectedInstance,
    loadingDetail,
    verifying,
    filteredData,
    isMyTurn,
    handleSelectInstance,
    handleVerifySubmit,
  } = useInstanceVerificationDashboard();

  const { data: dataProcess, loading: loadingProcess } = useProcessAll();
  // State untuk Modal Verifikasi Pertama (First Verification)
  const [contextData, setContextData] = useState<Record<string, string>>({});
  const [isFirstVerifyModalOpen, setIsFirstVerifyModalOpen] = useState(false);
  const [firstVerifyProcessId, setFirstVerifyProcessId] = useState<
    string | number
  >("");
  const [firstVerifyStaffId, setFirstVerifyStaffId] = useState<string | number>(
    "",
  );
  const [firstVerifyNotes, setFirstVerifyNotes] = useState("");

  // Hook Verifikasi Pertama
  const { verifyFirst, loading: loadingFirstVerify } = useInstanceVerifyFirst(
    () => {
      setIsFirstVerifyModalOpen(false);
      setFirstVerifyNotes("");
      setFirstVerifyStaffId("");
    },
  );

  const handleConfirmFirstVerify = () => {
    if (!firstVerifyProcessId || !firstVerifyStaffId) return;
    verifyFirst(firstVerifyProcessId, {
      staff_id: firstVerifyStaffId,
      notes: firstVerifyNotes,
      context_data: contextData,
    });
  };
  // Cari data proses yang sedang dipilih di dropdown
  const selectedProcessObj = useMemo(() => {
    if (!dataProcess?.initiable_processes) return null;
    return dataProcess.initiable_processes.find(
      (item: any) => String(item.id) === String(firstVerifyProcessId),
    );
  }, [dataProcess, firstVerifyProcessId]);

  // Ambil daftar schema field dari context_template proses tersebut
  const contextFields =
    selectedProcessObj?.context_template?.fields_schema?.fields || [];
  console.log(dataProcess);
  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden bg-base-100/50">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[{ label: "Home", path: "/" }, { label: "Dashboard" }]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              label="Verifikasi Pertama"
              onClick={() => setIsFirstVerifyModalOpen(true)}
              icon={PlusCircle}
              color="accent"
              className="h-9 text-xs sm:text-sm"
            />
          </div>
        </div>
      </PageTop>
      <PageMiddle>
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-4 h-full min-h-0 overflow-hidden">
          {/* Kolom Kiri: List Pasien */}
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
                {loadingInstance ? (
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
                      onSelect={handleSelectInstance}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Kolom Kanan: Detail & Aksi */}
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

                    {(() => {
                      const statusInfo = getInstanceStatusInfo(
                        selectedInstance.status,
                      );
                      return (
                        <span className={`badge px-3 py-2 ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      );
                    })()}
                  </div>

                  <div className="flex flex-col h-full min-h-0 gap-5 overflow-y-auto pr-2 mt-4">
                    {selectedInstance.status?.toLowerCase() === "completed" ||
                    selectedInstance.completed_at ? (
                      <div className="alert alert-success py-3 rounded-xl border border-success/30 bg-success/10 text-success-content flex items-center gap-2 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                        <span className="text-sm font-medium">
                          Semua tahapan verifikasi telah selesai.
                        </span>
                      </div>
                    ) : !isMyTurn ? (
                      <div className="p-3.5 rounded-xl bg-warning/10 border border-warning/30 text-warning-content flex items-center gap-3 shrink-0 shadow-2xs">
                        <Clock className="w-5 h-5 text-warning shrink-0" />
                        <span className="text-body font-medium text-base-content/90">
                          Menunggu verifikasi dari unit:{" "}
                          <strong>
                            {selectedInstance.current_stage?.departments
                              ?.map((d: any) => d.name)
                              .join(", ") || "-"}
                          </strong>
                        </span>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-3 shrink-0">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Aksi Verifikasi Tahap Ini (
                          {selectedInstance.current_stage?.stage_name})
                        </span>

                        <div className="flex flex-row gap-2 items-end">
                          <div className="flex-1">
                            <FormInput
                              label=""
                              options={
                                Array.isArray(dataStaff)
                                  ? dataStaff.map((item: any) => ({
                                      label: item.name,
                                      value: item.id,
                                    }))
                                  : []
                              }
                              dropdownType="select"
                              value={selectedStaffId}
                              onChange={(val) => setSelectedStaffId(val)}
                              disabled={loadingStaff}
                              placeholder="Pilih staff verifikator"
                            />
                          </div>
                          <ActionButton
                            disabled={!selectedStaffId || verifying}
                            onClick={handleVerifySubmit}
                            icon={Check}
                            color="primary"
                            label={verifying ? "Memproses..." : "Verifikasi"}
                            className="h-11"
                          />
                        </div>
                      </div>
                    )}

                    <InstanceTimeline
                      timeline={selectedInstance.stages_timeline || []}
                      processName={selectedInstance.process?.name}
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-4 border-t-2 border-base-300 pt-3">
                    <div className="divide-y divide-base-300/70">
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
      {isFirstVerifyModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg space-y-4">
            <h3 className="font-bold text-lg">
              Verifikasi Pertama (Buat Instance Baru)
            </h3>
            <p className="text-sm text-base-content/70">
              Pilih Process Template terlebih dahulu untuk memunculkan form data
              pasien.
            </p>

            <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto pr-1">
              {/* 1. Dropdown Pilih Process Template */}
              <FormInput
                label="Process Template"
                dropdownType="select"
                required
                value={firstVerifyProcessId}
                onChange={(val) => {
                  setFirstVerifyProcessId(val);
                  setContextData({}); // Reset data context saat template diganti
                }}
                options={
                  Array.isArray(dataProcess?.initiable_processes)
                    ? dataProcess.initiable_processes.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                disabled={loadingProcess}
                placeholder="Pilih process template"
              />

              {/* 2. Dropdown Pilih Staff Verifikator */}
              <FormInput
                label="Staff Verifikator"
                options={
                  Array.isArray(dataStaff)
                    ? dataStaff.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                dropdownType="select"
                required
                value={firstVerifyStaffId}
                onChange={(val) => setFirstVerifyStaffId(val)}
                disabled={loadingStaff}
                placeholder="Pilih staff verifikator"
              />

              {/* 3. DINAMIS FORM INPUT BERDASARKAN CONTEXT TEMPLATE (Hanya muncul jika process dipilih) */}
              {contextFields.length > 0 && (
                <div className="divider text-xs text-base-content/50 uppercase tracking-wider my-2">
                  Data Context Pasien
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
                {contextFields.map((field: any) => (
                  <div key={field.key} className="w-full">
                    <FormInput
                      label={field.label}
                      type={field.type || "text"}
                      required={field.required}
                      placeholder={
                        field.placeholder ||
                        `Masukkan ${field.label.toLowerCase()}...`
                      }
                      value={contextData[field.key] || ""}
                      onChange={(val) =>
                        setContextData((prev: Record<string, string>) => ({
                          ...prev,
                          [field.key]: val,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              {/* 4. Catatan Opsional */}
              <FormInput
                label="Catatan (Opsional)"
                type="text"
                value={firstVerifyNotes}
                onChange={(val) => setFirstVerifyNotes(val)}
                placeholder="Catatan tambahan..."
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsFirstVerifyModalOpen(false)}
                disabled={loadingFirstVerify}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmFirstVerify}
                disabled={
                  !firstVerifyProcessId ||
                  !firstVerifyStaffId ||
                  loadingFirstVerify
                }
              >
                {loadingFirstVerify
                  ? "Menyimpan..."
                  : "Simpan Verifikasi Pertama"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
