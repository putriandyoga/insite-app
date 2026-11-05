import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import { PageMiddle, PageTop } from "@/components/PageLayout";
import {
  UserCheck,
  Search,
  HelpCircle,
  XCircle,
  Edit3,
  ListOrdered,
  History,
} from "lucide-react";
import { InstanceCardItem } from "@patient-verification/components/InstanceCardItem";
import FormInput from "@/components/FormInput";
import { DetailRowItem } from "@/components/DetailRowItem";
import { formatDateIndo, formatTime } from "@/utils/dateFormater";
import ActionButton from "@/components/ActionButton";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { IndicatorEmpty } from "@/components/IndicatorEmptyData";
import { useAdminInstanceHistory } from "@/apps/patient-verification/hooks/dashboard/use-admin-instance-history";
import { useAdminInstanceDetail } from "@patient-verification/hooks/dashboard/use-admin-instance-detail";
import { InstanceHistoryTimeline } from "@patient-verification/components/InstanceHistoryTimeline";
import { InstanceContextLogsCard } from "@patient-verification/components/InstanceContextLogsCard";
import { useAdminInstanceModal } from "../../hooks/dashboard/use-admin-instance-modal";

const DashboardAdminPage = () => {
  const {
    loadingInstance,
    refetchInstance,
    searchQuery,
    setSearchQuery,
    selectedId,
    filteredData,
    handleSelectInstance,
    statusFilter,
    setStatusFilter,
  } = useAdminInstanceHistory();

  const {
    selectedInstance,
    instanceDetail,
    contextLogs,
    loadingDetail,
    cancelling,
    updatingContext,
    activeTab, // <--- Ambil dari hook detail
    setActiveTab, // <--- Ambil dari hook detail
    handleCancelInstance,
    handleUpdateContext,
  } = useAdminInstanceDetail(selectedId, refetchInstance);

  const {
    isUpdateContextModalOpen,
    editContextData,
    setEditContextData,
    changeReason,
    setChangeReason,
    handleOpenUpdateContextModal,
    handleCloseUpdateContextModal,
    contextFields,
  } = useAdminInstanceModal(instanceDetail, selectedInstance);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden bg-base-100/50">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard Admin" },
              ]}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9"></div>
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
                  Daftar Pasien
                </span>
                <span className="badge badge-primary badge-sm font-bold">
                  {filteredData.length}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <div className="col-span-1">
                  <FormInput
                    label=""
                    dropdownType="select"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    showEmptyOption={false}
                    showSearch={false}
                    options={[
                      { label: "Process", value: "process" },
                      { label: "Done", value: "completed" },
                      { label: "All", value: "all" },
                    ]}
                  />
                </div>
                <div className="col-span-2">
                  <FormInput
                    placeholder="Cari pasien / RM"
                    value={searchQuery}
                    onChange={setSearchQuery}
                    label=""
                    icon={Search}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingInstance ? (
                  <div className="pt-2">
                    <IndicatorLoading />
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="pt-2">
                    <IndicatorEmpty
                      message="Data Tidak Ditemukan"
                      description="Coba ubah kata kunci atau filter pencarian."
                      icon={HelpCircle}
                      color="primary"
                    />
                  </div>
                ) : (
                  filteredData.map((item: any) => (
                    <div key={item.id} className="pt-2">
                      <InstanceCardItem
                        item={item}
                        isSelected={selectedId === item.id}
                        onSelect={handleSelectInstance}
                      />
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Kolom Kanan: Detail History & Aksi Admin */}
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
                    untuk melihat riwayat audit trail dan mengelola instance.
                  </p>
                </div>
              ) : loadingDetail ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-base-content/60 text-sm">
                  <span className="loading loading-spinner loading-md text-primary mb-2"></span>
                  Memuat riwayat history pasien...
                </div>
              ) : !selectedInstance ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-error text-sm">
                  Gagal memuat data history instance pasien.
                </div>
              ) : (
                <>
                  {/* Header Info Pasien */}
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
                    {instanceDetail.status != "completed" && (
                      <div className="flex flex-row gap-2">
                        <ActionButton
                          tooltip="Update Context"
                          color="warning"
                          icon={Edit3}
                          onClick={handleOpenUpdateContextModal}
                        />

                        <ActionButton
                          tooltip={
                            cancelling ? "Membatalkan..." : "Batalkan Instance"
                          }
                          color="error"
                          icon={XCircle}
                          disabled={cancelling}
                          onClick={handleCancelInstance}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    role="tablist"
                    className="tabs tabs-lift shrink-0 grid grid-cols-2 w-full"
                  >
                    <a
                      role="tab"
                      className={`tab gap-2 w-full justify-center ${activeTab === "audit" ? "tab-active font-semibold bg-primary/60" : ""}`}
                      onClick={() => setActiveTab("audit")}
                    >
                      <ListOrdered className="w-4 h-4" />
                      Audit Trail
                    </a>

                    <a
                      role="tab"
                      className={`tab tab-primary gap-2 w-full justify-center ${activeTab === "logs" ? "tab-active font-semibold bg-primary/60" : ""}`}
                      onClick={() => setActiveTab("logs")}
                    >
                      <History className="w-4 h-4" />
                      Context Logs{" "}
                      {contextLogs.length > 0 && `(${contextLogs.length})`}
                    </a>
                  </div>

                  {/* Area Konten Berdasarkan Tab yang Aktif */}
                  <div className="flex-1 min-h-0 overflow-y-auto bg-base-100 border border-base-300 p-4 rounded-b-box rounded-tr-box">
                    {activeTab === "audit" ? (
                      <InstanceHistoryTimeline
                        stages={selectedInstance.stages || []}
                        withHeader={false}
                      />
                    ) : (
                      <InstanceContextLogsCard
                        logs={contextLogs}
                        withHeader={false}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-4 border-t-2 border-base-300 mt-2">
                    <div className="divide-y divide-base-300/70">
                      <DetailRowItem label="Nama Proses">
                        <span>{instanceDetail?.process?.name}</span>
                      </DetailRowItem>
                      <DetailRowItem label="Template Digunakan">
                        <span>{instanceDetail?.context_template?.name}</span>
                      </DetailRowItem>
                      <DetailRowItem label="Total Durasi">
                        <span>
                          {instanceDetail?.total_duration_minutes} Menit
                        </span>
                      </DetailRowItem>
                      <DetailRowItem label="Dimulai Sejak">
                        <span>
                          {formatDateIndo(instanceDetail?.started_at)} -{" "}
                          {formatTime(instanceDetail?.started_at)}
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

      {isUpdateContextModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl space-y-3">
            <h3 className="font-bold text-lg">Update Context Data Pasien</h3>
            <p className="text-sm text-base-content/70">
              Sesuaikan informasi data pasien berdasarkan template proses yang
              aktif.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto p-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      value={editContextData[field.key] || ""}
                      onChange={(val) =>
                        setEditContextData((prev: Record<string, any>) => ({
                          ...prev,
                          [field.key]: val,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="divider text-xs text-base-content/50 uppercase tracking-wider my-2">
                Audit Perubahan
              </div>

              <FormInput
                label="Alasan Perubahan (Change Reason)"
                type="textarea"
                required
                value={changeReason}
                onChange={setChangeReason}
                placeholder="Contoh: Perubahan data berdasarkan konfirmasi keluarga..."
              />
            </div>

            <div className="modal-action">
              <ActionButton
                label="Batal"
                onClick={handleCloseUpdateContextModal} // <--- Ubah dari setIsUpdateContextModalOpen(false) jadi ini
                color="base-300"
              />
              <ActionButton
                label={updatingContext ? "Menyimpan..." : "Simpan Perubahan"}
                color="primary"
                disabled={!changeReason.trim() || updatingContext}
                onClick={() =>
                  handleUpdateContext(
                    editContextData,
                    changeReason,
                    handleCloseUpdateContextModal,
                  )
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdminPage;
