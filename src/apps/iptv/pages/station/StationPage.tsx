import { useStationList } from "@iptv/hooks/station/use-station-list";
import ActionButton from "@/components/ActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { PenBox } from "lucide-react";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import { formatDateIndoWithTime, formatTimeAgo } from "@/utils/dateFormater";

const StationPage = () => {
  const { page, setPage, activeFilters } = useTableFilters(
    {},
    {
      storeKey: "station-management-page",
    },
  );
  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useStationList(page, activeFilters);

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "Station" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/station/create"
              icon={PenBox}
              label="Tambah Station"
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
              emptyMessage="Belum Ada Data Station"
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
                  },
                  {
                    header: "Station",
                    accessor: "name",
                  },
                  {
                    header: "Status",
                    render: (row) => (
                      <span
                        className={`badge ${
                          row.status === "ACTIVE"
                            ? "badge-primary"
                            : "badge-error"
                        } badge-sm`}
                      >
                        {row.status}
                      </span>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Koneksi",
                    render: (row) => (
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`badge ${
                            row.online ? "badge-success" : "badge-ghost"
                          } badge-sm gap-1`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.online
                                ? "bg-success-content animate-pulse"
                                : "bg-base-content/40"
                            }`}
                          ></span>
                          {row.online ? "Online" : "Offline"}
                        </span>
                        {row.live && (
                          <span className="text-caption text-info font-medium uppercase tracking-wider">
                            Live Active
                          </span>
                        )}
                      </div>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Terakhir Dilihat",
                    render: (row) => (
                      <div>
                        {row.last_seen_at ? (
                          <div className="flex flex-row justify-between">
                            {" "}
                            <div>
                              {formatDateIndoWithTime(row.last_seen_at)}
                            </div>
                            <div>{formatTimeAgo(row.last_seen_at)}</div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    ),
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

export default StationPage;
