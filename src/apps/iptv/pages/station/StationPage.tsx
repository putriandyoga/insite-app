import { useTableFilters } from "@/hooks/use-table-filters";
import { useStationList } from "@iptv/hooks/station/use-station-list";
import { useStationStore } from "@iptv/store/stationStore";
export default function StationPage() {
  // 1. Panggil hook Zustand store di sini
  const stationStore = useStationStore();

  // 2. Oper store tersebut ke useTableFilters
  const {
    page,
    setPage,
    searchTitle,
    filters,
    activeFilters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
  } = useTableFilters(stationStore);

  // 3. Panggil list data
  const { data, total, lastPage, loading, isFetching } = useStationList({
    page,
    per_page: 20,
    search: activeFilters.search,
    status: filters.status,
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Manajemen Station IPTV</h1>

      {/* Input Search & Filter */}
      <div className="flex gap-4 items-center">
        <input
          type="text"
          placeholder="Cari station..."
          value={searchTitle}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="input input-bordered"
        />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="select select-bordered"
        >
          <option value="">Semua Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button onClick={resetFilters} className="btn btn-ghost">
          Reset
        </button>

        {isFetching && <span className="text-sm text-gray-400">Memuat...</span>}
      </div>

      {/* Tabel */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table w-full">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Ward</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((station) => (
              <tr key={station.id}>
                <td>{station.name}</td>
                <td>{station.ward_name}</td>
                <td>{station.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
