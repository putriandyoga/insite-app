import { useCallback, useState } from "react";
import { useProcessDelete } from "@patient-verification/hooks/process/use-process-delete";
import { useProcessList } from "@patient-verification/hooks/process/use-process-list";
import { PageTop, PageMiddle, PageBottom } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import {
  CheckCircle,
  Copy,
  Download,
  Eye,
  FolderArchive,
  MoreHorizontal,
  PenBox,
  Pencil,
  RotateCcw,
  Trash,
} from "lucide-react";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import ActionDropdownButton from "@/components/ActionDropdownButton";
import { useProcessPublish } from "@patient-verification/hooks/process/use-process-publish";
import { useProcessArchive } from "@patient-verification/hooks/process/use-process-archive";
import { useProcessRevertToDraft } from "@patient-verification/hooks/process/use-process-revert-draft";
import { useProcessDuplicate } from "@patient-verification/hooks/process/use-process-duplicate";
import { getProcessStatusInfo } from "@patient-verification/constants/processStatusMap";
import {
  useProcessBulkExport,
  useProcessExport,
} from "@patient-verification/hooks/process/use-process-export";
import FormInput from "@/components/FormInput";

const ProcessPage = () => {
  const { page, setPage, activeFilters } = useTableFilters(
    {},
    {
      storeKey: "process-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useProcessList(page, activeFilters);
  const { handleDelete } = useProcessDelete();
  const { createDuplicate, loading: loadingNewVersion } = useProcessDuplicate();
  const { publishProcess, loading: loadingPublish } = useProcessPublish();
  const { archiveProcess, loading: loadingArchive } = useProcessArchive();
  const { revertToDraft, loading: loadingRevert } = useProcessRevertToDraft();

  // State untuk checkbox pilihan baris (Bulk)
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  // State untuk Modal & Rentang Tanggal Export
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"single" | "bulk">("single");
  const [targetId, setTargetId] = useState<string | number | null>(null);

  const handleSingleExportSuccess = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleBulkExportSuccess = useCallback(() => {
    setSelectedIds([]);
    setIsModalOpen(false);
  }, []);

  // Hook Export & Bulk Export
  const { exportProcess, loading: loadingSingleExport } = useProcessExport(
    handleSingleExportSuccess,
  );
  const { exportBulk, loading: loadingBulkExport } = useProcessBulkExport(
    handleBulkExportSuccess,
  );

  // Form input tanggal export
  const [exportFilters, setExportFilters] = useState({
    start_date: "",
    end_date: "",
  });

  const handleFilterChange = (field: string, val: any) => {
    setExportFilters((prev) => ({ ...prev, [field]: val }));
  };

  // Trigger buka modal untuk single export
  const openSingleExportModal = (id: string | number) => {
    setExportType("single");
    setTargetId(id);
    setIsModalOpen(true);
  };

  // Trigger buka modal untuk bulk export
  const openBulkExportModal = () => {
    if (selectedIds.length === 0) return;
    setExportType("bulk");
    setTargetId(null);
    setIsModalOpen(true);
  };

  // Eksekusi Submit Export dari dalam Modal
  const handleConfirmExport = () => {
    const payload = {
      // Tambahkan suffix jam agar tanggal akhir mencakup sampai akhir hari
      date_from: `${exportFilters.start_date}`,
      date_to: `${exportFilters.end_date}`,
    };

    if (exportType === "single" && targetId !== null) {
      exportProcess(targetId, payload);
    } else if (exportType === "bulk") {
      exportBulk({
        process_ids: selectedIds,
        ...payload,
      });
    }
  };

  // Handler Select All Checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = data.map((item) => item.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Handler Checkbox per Baris
  const handleCheckboxChange = (id: string | number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;
  const isExporting = loadingSingleExport || loadingBulkExport;

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                {
                  label: "Dashboard",
                  path: "/app/patient-verification/dashboard",
                },
                { label: "Process Template" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              onClick={openBulkExportModal}
              disabled={selectedIds.length === 0 || isExporting}
              icon={Download}
              label={`Bulk Export (${selectedIds.length})`}
              color="accent"
            />

            <ActionButton
              to="/app/patient-verification/process/create"
              icon={PenBox}
              label="Tambah Process"
              color="primary"
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
              emptyMessage="Belum Ada Data Process"
            />

            {!loading && !error && data.length > 0 && (
              <TableBase
                columns={[
                  {
                    header: (
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    ),
                    render: (row) => (
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedIds.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                      />
                    ),
                    className: "text-center w-12",
                  },
                  {
                    header: "No",
                    render: (_, index) => (page - 1) * perPage + index + 1,
                    className: "text-center w-12",
                  },
                  {
                    header: "Nama",
                    render: (row) => (
                      <div className="flex flex-col">
                        {row.name}
                        <span className="text-xs text-base-content/60 font-mono">
                          {row.process_code}v{row.version}
                        </span>
                      </div>
                    ),
                  },
                  {
                    header: "Deskripsi",
                    accessor: "description",
                    className: "max-w-80",
                  },
                  {
                    header: "Context Template",
                    render: (row) => {
                      const template = row.context_template;
                      const hasTemplate =
                        template && (template.name || template.id);

                      return (
                        <div className="flex items-center justify-between gap-4 w-full">
                          <div className="flex flex-col">
                            {hasTemplate ? (
                              <span>{template.name || "Tanpa Nama"}</span>
                            ) : (
                              <span className="italic text-base-content/40">
                                Belum diatur
                              </span>
                            )}
                          </div>

                          {template?.id && (
                            <ActionButton
                              to={`/app/patient-verification/context/${template.id}`}
                              icon={Eye}
                              color="primary"
                              tooltip="Lihat Context"
                            />
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    header: "Jumlah Tahap",
                    render: (row) => <span>{row.total_stages} Tahap</span>,
                    className: "text-center",
                  },
                  {
                    header: "Status",
                    render: (row) => {
                      const statusInfo = getProcessStatusInfo(row.status);

                      return (
                        <span
                          className={`badge badge-sm font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      );
                    },
                    className: "text-center",
                  },
                  {
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        <ActionButton
                          to={`/app/patient-verification/process/${row.id}`}
                          icon={Eye}
                          color="primary"
                          tooltip="Lihat Data"
                        />
                        <ActionButton
                          to={`/app/patient-verification/process/${row.id}/edit`}
                          icon={Pencil}
                          color="warning"
                          tooltip="Edit Data"
                        />
                        <ActionButton
                          onClick={() => handleDelete(row.id)}
                          icon={Trash}
                          color="error"
                          tooltip="Hapus Data"
                        />
                        <ActionDropdownButton
                          icon={MoreHorizontal}
                          label="Aksi Lainnya"
                          color="accent"
                          items={[
                            {
                              label: "Export Report",
                              onClick: () => openSingleExportModal(row.id),
                              icon: Download,
                            },
                            {
                              label: "Publish",
                              onClick: () => publishProcess(row.id),
                              disabled: loadingPublish,
                              icon: CheckCircle,
                            },
                            {
                              label: "Duplicate",
                              onClick: () => createDuplicate(row.id),
                              disabled: loadingNewVersion,
                              icon: Copy,
                            },
                            {
                              label: "Archive",
                              onClick: () => archiveProcess(row.id),
                              disabled: loadingArchive,
                              icon: FolderArchive,
                            },
                            {
                              label: "Revert to Draft",
                              onClick: () => revertToDraft(row.id),
                              disabled: loadingRevert,
                              icon: RotateCcw,
                            },
                          ]}
                        />
                      </div>
                    ),
                    className: "text-center",
                  },
                ]}
                data={data}
              />
            )}
          </div>
        </Card>
      </PageMiddle>

      <PageBottom>
        <Pagination
          page={page}
          lastPage={lastPage}
          perPage={perPage}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </PageBottom>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md space-y-4">
            <h3 className="font-bold text-lg">
              {exportType === "single"
                ? "Export Process Report"
                : `Bulk Export (${selectedIds.length} Process)`}
            </h3>
            <p className="text-sm text-base-content/70">
              Silakan pilih rentang tanggal (start date & end date) untuk data
              laporan yang ingin diexport.
            </p>

            <div className="space-y-3 py-2">
              <FormInput
                label="Tanggal Mulai"
                type="date"
                value={exportFilters.start_date}
                onChange={(val) => handleFilterChange("start_date", val)}
                className="w-full"
                disableFuture
              />

              <FormInput
                label="Tanggal Akhir"
                type="date"
                value={exportFilters.end_date}
                onChange={(val) => handleFilterChange("end_date", val)}
                className="w-full"
                disableFuture
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsModalOpen(false)}
                disabled={isExporting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleConfirmExport}
                disabled={isExporting}
              >
                {isExporting ? "Mengexport..." : "Download Export"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessPage;
