import { useRoomDelete } from "@iptv/hooks/master/room/use-room-delete";
import { useRoomList } from "@iptv/hooks/master/room/use-room-list";
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
import { PenBox, Pencil, RotateCcw, Trash } from "lucide-react";
import IndicatorFetching from "@/components/IndicatorFetchingData";

const RoomPage = () => {
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
      storeKey: "room-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useRoomList(page, activeFilters);

  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );

  const { handleDelete } = useRoomDelete();

  const isFilterActive = Boolean(
    searchTitle || filters.status || filters.ward_id,
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
                { label: "Ruangan" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/room/create"
              icon={PenBox}
              label="Tambah Ruangan"
              color="primary"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm items-end shrink-0">
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
              label="Cari Ruangan"
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

          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative rounded-xl border border-base-200 md:overflow-auto">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data Ruangan"
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
                    header: "Ruang Perawatan",
                    accessor: "ward_name",
                    className: "max-w-xs",
                  },
                  {
                    header: "Label",
                    accessor: "label",
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
                    className: "text-center",
                  },
                  {
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        <ActionButton
                          to={`/iptv/room/${row.id}/edit`}
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

export default RoomPage;
