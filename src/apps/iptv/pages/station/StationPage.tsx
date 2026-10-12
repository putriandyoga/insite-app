import Breadcrumb from "@/components/Breadcrumb";
import { useTableFilters } from "@/hooks/use-table-filters";
import { useStationList } from "@iptv/hooks/station/use-station-list";

const StationPage = () => {
  const {
    page,
    searchTitle,
    debouncedSearch,
    filters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useTableFilters(
    {
      status: "",
      ward_id: "",
    },
    {
      searchKey: "title",
      storeKey: "station-management-page",
    },
  );

  const {
    data = [],
    total,
    loading,
    isFetching,
  } = useStationList(page, debouncedSearch || undefined);
  return (
    <div className="flex flex-col gap-4 max-w-full">
      <div className="flex flex-col lg:flex-row justify-between gap-4">
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Dashboard", path: "/app/iptv/dashboard" },
            { label: "Survey" },
          ]}
        />

        {/* <div className="h-10"></div> */}
        {/* <ActionButton
          to="/survey/question/create"
          icon={PenBox}
          label="Buat Survey"
          color="primary"
        /> */}
      </div>
      {/* Header Halaman */}
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="heading-h2 text-primary">Manajemen Station IPTV</h1>
          <p className="text-body mt-1">
            Kelola data station, status, dan pemantauan perangkat IPTV rumah
            sakit.
          </p>
        </div>
        {isFetching && (
          <span className="text-caption text-primary animate-pulse">
            Memperbarui data...
          </span>
        )}
      </div>

      {/* Filter & Search Section */}
      <div className="bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <input
            type="text"
            placeholder="Cari station..."
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
        </div>

        {total !== undefined && (
          <div className="text-data text-base-content/70">
            Total: <span className="font-bold text-base-content">{total}</span>{" "}
            station
          </div>
        )}
      </div>

      {/* Tabel Data */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-body text-base-content/60">
            Memuat data station...
          </div>
        ) : data.length === 0 ? (
          <div className="p-8 text-center text-body text-base-content/60">
            Tidak ada data station yang ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300 text-data uppercase">
                  <th className="py-4 px-6">Nama</th>
                  <th className="py-4 px-6">Ward</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((station) => (
                  <tr
                    key={station.id}
                    className="hover:bg-base-200/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-medium">{station.name}</td>
                    <td className="py-4 px-6 text-base-content/80">
                      {station.ward_name || "-"}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`badge badge-sm font-semibold ${
                          station.status === "ACTIVE"
                            ? "badge-success text-success-content"
                            : "badge-error text-error-content"
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StationPage;
