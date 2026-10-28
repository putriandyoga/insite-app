import { PageTop, PageMiddle } from "@/components/PageLayout";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import ActionButton from "@/components/ActionButton";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import { Eye, History, FileText, XCircle } from "lucide-react";
import ActionDropdownButton from "@/components/ActionDropdownButton";
import { useInstanceMyDepartment } from "../../hooks/instances/use-instances-my-departement";
import { useInstanceCancel } from "../../hooks/instances/use-instances-cancel";
import { useInstanceHistory } from "../../hooks/instances/use-instances-history";
import { useInstanceContextLogs } from "../../hooks/instances/use-instances-context-log";

const InstancesPage = () => {
  const { page, setPage } = useTableFilters({}, { storeKey: "instances-page" });

  // 1. Ambil data khusus My Department
  const { instances, loading, error, refetch } = useInstanceMyDepartment();

  // 2. Ambil fungsi action hooks
  const { cancelInstance, loading: loadingCancel } = useInstanceCancel(() => {
    refetch(); // Refresh data setelah cancel berhasil
  });

  const { fetchHistory } = useInstanceHistory();
  const { fetchContextLogs } = useInstanceContextLogs();

  // Handler untuk melihat History audit trail
  const handleViewHistory = async (id: string | number) => {
    const history = await fetchHistory(id);
    console.log("Data History:", history);
    // TODO: Tampilkan modal atau arahkan ke halaman detail history
  };

  // Handler untuk melihat Context Logs
  const handleViewContextLogs = async (id: string | number) => {
    const logs = await fetchContextLogs(id);
    console.log("Data Context Logs:", logs);
    // TODO: Tampilkan modal log perubahan
  };

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 w-full py-1">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Instances Departemen Saya" },
            ]}
          />
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto md:overflow-hidden h-full p-4">
          <h2 className="text-xl font-bold">
            Daftar Verifikasi Instance (My Department)
          </h2>

          {!loading && !error && instances.length > 0 && (
            <TableBase
              columns={[
                {
                  header: "No",
                  render: (_, index) => index + 1,
                  className: "text-center w-12",
                },
                {
                  header: "Ticket Code",
                  accessor: "ticket_code",
                },
                {
                  header: "Nama Process",
                  render: (row) => row.process?.name || "-",
                },
                {
                  header: "Status",
                  render: (row) => (
                    <span className="badge badge-sm badge-outline font-medium">
                      {row.status}
                    </span>
                  ),
                  className: "text-center",
                },
                {
                  header: "Progress",
                  render: (row) => `${row.progress_percentage}%`,
                  className: "text-center",
                },
                {
                  header: "Aksi",
                  render: (row) => (
                    <div className="inline-flex justify-center gap-2">
                      <ActionButton
                        to={`/app/instances/${row.id}`}
                        icon={Eye}
                        color="primary"
                        tooltip="Detail Instance"
                      />
                      <ActionDropdownButton
                        icon={History}
                        label="Opsi Lain"
                        color="accent"
                        items={[
                          {
                            label: "Lihat History Audit",
                            onClick: () => handleViewHistory(row.id),
                            icon: History,
                          },
                          {
                            label: "Log Perubahan Context",
                            onClick: () => handleViewContextLogs(row.id),
                            icon: FileText,
                          },
                          {
                            label: "Batalkan Instance",
                            onClick: () => cancelInstance(row.id),
                            disabled: loadingCancel,
                            icon: XCircle,
                          },
                        ]}
                      />
                    </div>
                  ),
                  className: "text-center",
                },
              ]}
              data={instances}
            />
          )}
        </Card>
      </PageMiddle>
    </div>
  );
};

export default InstancesPage;
