import { useUserDelete } from "@iptv/hooks/user/use-user-delete";
import { useUserList } from "@iptv/hooks/user/use-user-list";
import { PageTop, PageMiddle, PageBottom } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import {
  Eye,
  KeyRound,
  Lock,
  PenBox,
  Pencil,
  ShieldAlert,
  Trash,
  Unlock,
} from "lucide-react";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import { CopyButton } from "@/components/CopyButton";
import { useUserEnable } from "@iptv/hooks/user/use-user-enable";
import { useUserDisable } from "@iptv/hooks/user/use-user-disable";
import { useUserRevokeSessions } from "@iptv/hooks/user/use-user-revoke-sessions";

const UserPage = () => {
  const { page, setPage, activeFilters } = useTableFilters(
    {
      // status: "",
      // ward_id: "",
    },
    {
      searchKey: "title",
      storeKey: "user-management-page",
    },
  );

  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useUserList(page, activeFilters);

  const { handleDelete } = useUserDelete();
  const { disableUser } = useUserDisable();
  const { enableUser } = useUserEnable();
  const { revokeSessions } = useUserRevokeSessions();

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "User" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/user/create"
              icon={PenBox}
              label="Tambah User"
              color="primary"
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full">
          <div className="flex flex-col lg:flex-1 lg:min-h-0 relative rounded-xl border border-base-200 md:overflow-auto">
            <DataSection
              loading={loading}
              error={error}
              data={data}
              emptyMessage="Belum Ada Data User"
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
                    header: "Username",
                    accessor: "username",
                    render: (row) => (
                      <div>
                        {row.username ? (
                          <div className="flex flex-row justify-between">
                            <span>{row.username}</span>
                            <CopyButton text={row.username} iconOnly />
                          </div>
                        ) : (
                          <div className="text-center">-</div>
                        )}
                      </div>
                    ),
                  },
                  {
                    header: "Role",
                    render: (row) => (
                      <span className="capitalize font-medium">{row.role}</span>
                    ),
                    className: "text-center",
                  },
                  {
                    header: "Station",
                    render: (row) => row.station?.name ?? "-",
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
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        <ActionButton
                          to={`/app/iptv/user//${row.id}`}
                          icon={Eye}
                          color="info"
                          tooltip="Lihat Detail"
                        />
                        <ActionButton
                          to={`/app/iptv/user//${row.id}/edit`}
                          icon={Pencil}
                          color="warning"
                          tooltip="Edit Data"
                        />

                        {row.status === "ACTIVE" ? (
                          <ActionButton
                            onClick={() => disableUser(row.id)}
                            icon={Lock}
                            color="neutral"
                            tooltip="Nonaktifkan User"
                          />
                        ) : (
                          <ActionButton
                            onClick={() => enableUser(row.id)}
                            icon={Unlock}
                            color="success"
                            tooltip="Aktifkan User"
                          />
                        )}

                        <ActionButton
                          to={`/app/iptv/user/${row.id}/reset-password`}
                          icon={KeyRound}
                          color="success"
                          tooltip="Reset Password"
                        />

                        <ActionButton
                          onClick={() => revokeSessions(row.id)}
                          icon={ShieldAlert}
                          color="accent"
                          tooltip="Cabut Semua Sesi"
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

export default UserPage;
