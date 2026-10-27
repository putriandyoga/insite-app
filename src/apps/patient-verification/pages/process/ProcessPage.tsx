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
                          {row.process_code} • v{row.version}
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
                          {/* Nama Template atau Status Belum Diatur */}
                          <div className="flex flex-col">
                            {hasTemplate ? (
                              <span>{template.name || "Tanpa Nama"}</span>
                            ) : (
                              <span className="italic text-base-content/40">
                                Belum diatur
                              </span>
                            )}
                          </div>

                          {/* Tombol Detail (Hanya muncul jika template dan ID-nya benar-benar ada) */}
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
    </div>
  );
};

export default ProcessPage;
