import { useBedList } from "@iptv/hooks/master/bed/use-bed-list";
import ActionButton from "@/components/ActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { PenBox } from "lucide-react";

const BedPage = () => {
  const {
    page,
    setPage,
    searchTitle,
    debouncedSearch,
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useTableFilters(
    {
      status: "",
      bed_id: "",
    },
    {
      searchKey: "title",
      storeKey: "bed-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useBedList(page, debouncedSearch || undefined);

  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full">
        <div className="overflow-x-auto py-1">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Dashboard", path: "/app/iptv/dashboard" },
              { label: "Bed" },
            ]}
          />
        </div>

        <div className="shrink-0">
          <ActionButton
            to="/app/iptv/bed/create"
            icon={PenBox}
            label="Tambah Bed"
            color="primary"
          />
        </div>
      </div>
      {/* Header Halaman */}

      {/* Filter & Search Section */}
      <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <input
            type="text"
            placeholder="Cari bed..."
            value={searchTitle}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input input-bordered w-full md:w-72 rounded-xl"
          />

          <select
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="select select-bordered rounded-xl"
          >
            <option value="">Semua Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>

          <button onClick={resetFilters} className="btn btn-ghost rounded-xl">
            Reset
          </button>

          {/* Indikator isFetching ditaruh di sini agar tetap informatif tanpa header */}
          {isFetching && (
            <div className="flex items-center gap-2 px-3 py-1.5 text-primary text-sm animate-pulse">
              <span className="loading loading-spinner loading-xs"></span>
              <span>Memperbarui...</span>
            </div>
          )}
        </div>

        {total !== undefined && (
          <div className="text-data text-base-content/70">
            Total: <span className="font-bold text-base-content">{total}</span>{" "}
            bed
          </div>
        )}
      </div>

      {/* Tabel Data */}
      <Card className="flex flex-col gap-4">
        <div className="w-full overflow-x-auto">
          <DataSection
            loading={loading}
            error={error}
            data={data}
            emptyMessage="Belum Ada Poliklinik"
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
                  header: "Ruang Perawatan (Ward)",
                  accessor: "ward_name",
                  render: (row) => row.ward_name,
                  className: "font-medium",
                },
                {
                  header: "Nomor Ruangan",
                  accessor: "room_label",
                  render: (row) => row.room_label,
                  className: "text-center",
                },
                {
                  header: "Label Bed",
                  accessor: "label",
                  render: (row) => (
                    <span className="badge badge-outline font-semibold px-3 py-1">
                      {row.label}
                    </span>
                  ),
                  className: "text-center",
                },
                {
                  header: "Status",
                  render: (row) => (
                    <span
                      className={`badge ${
                        row.archived ? "badge-error" : "badge-primary"
                      } badge-sm`}
                    >
                      {row.archived ? "Arsip" : "Aktif"}
                    </span>
                  ),
                  className: "text-center w-32",
                },
              ]}
              data={data}
            />
          )}
        </div>

        <Pagination
          page={page}
          lastPage={lastPage}
          perPage={perPage}
          total={total}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </Card>
    </div>
  );
};

export default BedPage;
