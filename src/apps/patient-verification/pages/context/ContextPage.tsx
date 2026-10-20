import { useContextDelete } from "@patient-verification/hooks/context/use-context-delete";
import { useContextList } from "@patient-verification/hooks/context/use-context-list";
import { PageTop, PageMiddle, PageBottom } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { Eye, PenBox, Pencil, Trash } from "lucide-react";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import { capitalizeEachWord } from "@/utils/capitalizer";

const ContextPage = () => {
  const { page, setPage, activeFilters } = useTableFilters(
    {},
    {
      storeKey: "context-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useContextList(page, activeFilters);
  const { handleDelete } = useContextDelete();

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
                { label: "Context Template" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/patient-verification/context/create"
              icon={PenBox}
              label="Tambah Context"
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
              emptyMessage="Belum Ada Data Context"
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
                    accessor: "name",
                  },
                  {
                    header: "Deskripsi",
                    accessor: "description",
                    className: "max-w-80",
                  },
                  {
                    header: "Identifiers",
                    render: (row) => {
                      // Cek apakah array ada isinya
                      if (
                        !row.unique_identifiers ||
                        row.unique_identifiers.length === 0
                      ) {
                        return (
                          <span className="text-gray-500">Belum diatur</span>
                        );
                      }

                      // Opsi 1: Ditampilkan sebagai teks biasa menggunakan join
                      // return <span>{row.unique_identifiers.join(", ")}</span>;

                      // Opsi 2: Ditampilkan sebagai badge kecil (Lebih direkomendasikan untuk UI modern)
                      return (
                        <ul className="list-disc list-inside space-y-1">
                          {row.unique_identifiers.map((item, idx) => (
                            <li key={idx}>{capitalizeEachWord(item)}</li>
                          ))}
                        </ul>
                      );
                    },
                  },
                  {
                    header: "Field",
                    accessor: "total_fields",
                    className: "text-center",
                  },
                  {
                    header: "Proses",
                    accessor: "used_by_processes_count",
                    className: "text-center",
                  },
                  {
                    header: "Status",
                    render: (row) => (
                      <span
                        className={`badge ${
                          row.is_active === true
                            ? "badge-primary"
                            : "badge-error"
                        } badge-sm`}
                      >
                        {row.is_active ? "Aktif" : "Non Aktif"}
                      </span>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        <ActionButton
                          to={`/app/patient-verification/context/${row.id}`}
                          icon={Eye}
                          color="primary"
                          tooltip="Lihat Data"
                        />
                        <ActionButton
                          to={`/app/patient-verification/context/${row.id}/edit`}
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

export default ContextPage;
