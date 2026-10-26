import { useCallList } from "@iptv/hooks/call/use-call-list";
import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
import { PageTop, PageMiddle, PageBottom } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import DataSection from "@/components/DataSection";
import FormInput from "@/components/FormInput";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { Calendar, Clock, FileSpreadsheet, RotateCcw } from "lucide-react";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import { formatDateIndo, formatTime } from "@/utils/dateFormater";
import type { DaisyColor } from "@/utils/color";
import { useExportCallExcel } from "@iptv/hooks/call/use-export-call";

const CallPage = () => {
  const {
    page,
    setPage,
    searchTitle,
    filters,
    activeFilters,
    handleFilterChange,
    resetFilters,
  } = useTableFilters(
    {
      start_date: "",
      end_date: "",
      kind: "",
      ward_id: "",
      per_page: 20,
    },
    {
      storeKey: "call-management-page",
    },
  );
  const currentPerPage = Number(filters.per_page) || 20;
  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useCallList(page, activeFilters, currentPerPage);

  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );
  const {
    exportCallExcel,
    loading: exporting,
    progress,
  } = useExportCallExcel();

  const isFilterActive = Boolean(
    searchTitle ||
    filters.start_date ||
    filters.end_date ||
    filters.kind ||
    filters.per_page != "20" ||
    filters.ward_id,
  );

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "Call" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              label={exporting ? `Exporting (${progress}%)` : "Export Excel"}
              onClick={() => exportCallExcel(data)}
              color="success"
              icon={FileSpreadsheet}
              disabled={loading || data.length === 0 || exporting}
              className="h-9 text-xs sm:text-sm"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full p-4">
          {/* Form Filter Sesuai Request: start_date, end_date, kind, ward_id */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm items-end shrink-0">
            <FormInput
              label="Ruang Perawatan"
              value={filters.ward_id}
              onChange={(val) => handleFilterChange("ward_id", val)}
              options={
                Array.isArray(wardList)
                  ? wardList.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              dropdownType="select"
              placeholder="Semua Ward"
              className="w-full"
              disabled={loadingWards}
            />

            <FormInput
              label="Jenis Call"
              value={filters.kind}
              onChange={(val) => handleFilterChange("kind", val)}
              options={[
                { label: "Nurse", value: "NURSE" },
                { label: "Cleaning", value: "CLEANING" },
                { label: "Linen", value: "LINEN" },
                { label: "Cashier", value: "CASHIER" },
              ]}
              dropdownType="select"
              placeholder="Semua Jenis"
              className="w-full"
              searchable={false}
            />
            <FormInput
              label="Tampilkan"
              value={filters.per_page}
              onChange={(val) => handleFilterChange("per_page", Number(val))}
              options={[
                { label: "20 Data", value: 20 },
                { label: "50 Data", value: 50 },
                { label: "100 Data", value: 100 },
                { label: "500 Data", value: 500 },
              ]}
              dropdownType="select"
              placeholder="Pilih Jumlah"
              className="w-full"
              searchable={false}
            />
            <FormInput
              label="Tanggal Mulai"
              type="date"
              value={filters.start_date}
              onChange={(val) => handleFilterChange("start_date", val)}
              className="w-full"
              formatApi={true}
              disableFuture
            />

            <FormInput
              label="Tanggal Akhir"
              type="date"
              value={filters.end_date}
              onChange={(val) => handleFilterChange("end_date", val)}
              className="w-full"
              formatApi={true}
              disableFuture
            />

            {isFilterActive && (
              <ActionButton
                label="Reset Filter"
                onClick={resetFilters}
                color="warning"
                className="w-full h-11.5"
                icon={RotateCcw}
              />
            )}
          </div>

          {/* Kolom Pencarian Tambahan (Opsional jika masih dibutuhkan) */}

          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative md:overflow-auto gap-4">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data Call"
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
                    header: "Ward",
                    accessor: "ward_name",
                  },
                  {
                    header: "Jenis",
                    accessor: "kind",
                  },
                  {
                    header: "Tekan",
                    render: (row) => (
                      <span>
                        {row.press_count > 1 ? `${row.press_count}x` : "1x"}
                      </span>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Dibuat",
                    render: (row) =>
                      row.created_at ? (
                        <div className="flex flex-col gap-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-body">
                            <Calendar
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatDateIndo(row.created_at, true)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-caption">
                            <Clock
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatTime(row.created_at)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-caption italic">-</span>
                      ),
                  },
                  {
                    header: "Terakhir Tekan",
                    render: (row) =>
                      row.last_pressed_at ? (
                        <div className="flex flex-col gap-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-body">
                            <Calendar
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>
                              {formatDateIndo(row.last_pressed_at, true)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-caption">
                            <Clock
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatTime(row.last_pressed_at)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-caption italic">-</span>
                      ),
                  },
                  {
                    header: "Direspon",
                    render: (row) =>
                      row.acked_at ? (
                        <div className="flex flex-col gap-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-body">
                            <Calendar
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatDateIndo(row.acked_at, true)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-caption">
                            <Clock
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatTime(row.acked_at)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-caption italic">-</span>
                      ),
                  },
                  {
                    header: "Selesai",
                    render: (row) =>
                      row.resolved_at ? (
                        <div className="flex flex-col gap-0.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-body">
                            <Calendar
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatDateIndo(row.resolved_at, true)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-caption">
                            <Clock
                              size={14}
                              className="shrink-0 text-base-content/60"
                            />
                            <span>{formatTime(row.resolved_at)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-caption italic">-</span>
                      ),
                  },
                  {
                    header: "Ditangani Oleh",
                    render: (row) => (
                      <span className="text-body text-base-content/80 font-medium">
                        {row.acked_by || "-"}
                      </span>
                    ),
                  },
                  {
                    header: "Status",
                    render: (row) => {
                      // Tentukan DaisyColor yang kalem untuk setiap status
                      let colorName: DaisyColor = "neutral";
                      if (row.status === "PENDING") colorName = "warning";
                      else if (row.status === "ACKNOWLEDGED")
                        colorName = "info";
                      else if (row.status === "RESOLVED") colorName = "success";

                      return (
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border bg-${colorName}/10 text-${colorName} border-${colorName}/30 shadow-2xs`}
                        >
                          {row.status}
                        </span>
                      );
                    },
                    className: "text-center",
                  },
                ]}
                data={data}
                stickyColumns={[{ index: 1, side: "left" }]}
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

export default CallPage;
