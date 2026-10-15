// import { useWardDelete } from "@iptv/hooks/master/ward/use-ward-delete";
import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
import ActionButton from "@/components/ActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { Archive, PenBox, Pencil, RotateCcw } from "lucide-react";
import { useWardArchive } from "@iptv/hooks/master/ward/use-ward-archive";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import FormInput from "@/components/FormInput";

const WardPage = () => {
  const {
    page,
    setPage,
    searchTitle,
    filters,
    activeFilters,
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
      storeKey: "ward-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useWardList(page, activeFilters);
  // const { handleDelete } = useWardDelete();
  const { archiveWard, loading: isArchiving } = useWardArchive();
  const isFilterActive = Boolean(searchTitle || filters.status);
  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "Ruang Perawatan" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/ward/create"
              icon={PenBox}
              label="Tambah Ruangan"
              color="primary"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm items-end shrink-0">
            <FormInput
              label="Cari Ruang Perawatan"
              value={searchTitle}
              onChange={(val) => handleSearchChange(val)}
              placeholder="Ketik label ruangan..."
            />

            <FormInput
              label="Status"
              value={filters.status}
              onChange={(val) => handleFilterChange("status", val)}
              options={[
                { label: "Aktif", value: "ACTIVE" },
                { label: "Arsip / Tidak Aktif", value: "INACTIVE" },
              ]}
              dropdownType="select"
              placeholder="Semua Status"
              className="w-full"
              searchable={false}
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

          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative md:overflow-auto gap-4">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data Ruang Perawatan"
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
                    header: "Nama Ward",
                    accessor: "name", // Disesuaikan dengan field JSON API "name"
                    render: (row) => row.name,
                    className: "max-w-xs",
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
                  {
                    header: "Aksi",

                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        {/* Tombol Edit */}
                        <ActionButton
                          to={`/app/iptv/ward/${row.id}/edit`}
                          icon={Pencil}
                          color="warning"
                          tooltip="Edit Data"
                        />

                        {/* Tombol Arsip */}
                        <ActionButton
                          onClick={() => archiveWard(row.id)}
                          icon={Archive}
                          color="secondary"
                          tooltip="Arsipkan Ward"
                          disabled={Boolean(row.archived) || isArchiving}
                        />
                      </div>
                    ),

                    className: "text-center w-100",
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

export default WardPage;
