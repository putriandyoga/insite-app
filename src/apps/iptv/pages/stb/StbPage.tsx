import { useStbList } from "@iptv/hooks/stb/use-stb-list";
import ActionButton from "@/components/ActionButton";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import DataSection from "@/components/DataSection";
import Pagination from "@/components/Pagination";
import TableBase from "@/components/TableBase";
import { useTableFilters } from "@/hooks/use-table-filters";
import {
  Activity,
  ArchiveRestore,
  Eye,
  KeyRound,
  Link2,
  Link2Off,
  PenBox,
  Pencil,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import IndicatorFetching from "@/components/IndicatorFetchingData";
import { formatDateIndoWithTime, formatTimeAgo } from "@/utils/dateFormater";
import { CopyButton } from "@/components/CopyButton";
import { showAlert } from "@/components/Alert";
import { useStbCreateEnrollmentCode } from "../../hooks/stb/use-stb-create-enroll";
import { useStbDeleteEnrollmentCode } from "../../hooks/stb/use-stb-delete-enroll";
import { useStbRevoke } from "../../hooks/stb/use-stb-revoke";
import { useStbRevive } from "../../hooks/stb/use-stb-revive";
import { useStbRetire } from "../../hooks/stb/use-stb-retire";
import { useStbUnbindBed } from "../../hooks/stb/use-stb-unbind-bed";
import { useStbBindBed } from "../../hooks/stb/use-stb-bind-bed";

const StbPage = () => {
  const { page, setPage, activeFilters } = useTableFilters(
    {}, // Initial filters kosong karena tidak ada dropdown filter tambahan
    {
      storeKey: "stb-management-page",
    },
  );
  const { data, loading, error, total, lastPage, perPage, isFetching } =
    useStbList(page, activeFilters);

  const { createEnrollmentCode } = useStbCreateEnrollmentCode();
  const { deleteEnrollmentCode } = useStbDeleteEnrollmentCode();

  const { revokeStb } = useStbRevoke();
  const { reviveStb } = useStbRevive();
  const { retireStb } = useStbRetire();

  const { bindBed } = useStbBindBed();
  const { unbindBed } = useStbUnbindBed();

  // Handler interaktif khusus untuk aksi yang memerlukan input note
  // Handler interaktif dengan modal input note
  const handleRevokeWithNote = async (id: string) => {
    const note = await showAlert({
      title: "Revoke STB",
      text: "Masukkan catatan/alasan revoke perangkat:",
      input: "text",
      inputPlaceholder: "Contoh: Perangkat ditarik sementara",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Ya, Revoke",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value.trim()) return "Catatan wajib diisi!";
      },
    });

    // Jika user menekan tombol Batal, nilainya false. Jika Konfirmasi, nilainya string note.
    if (typeof note === "string" && note.trim()) {
      await revokeStb(id, note);
    }
  };

  const handleRetireWithNote = async (id: string) => {
    const note = await showAlert({
      title: "Pensiunkan (Retire) STB",
      text: "Masukkan catatan alasan penggantian/pensiun perangkat:",
      input: "text",
      inputPlaceholder: "Contoh: TV diganti karena layar rusak",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Retire",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value.trim()) return "Catatan wajib diisi!";
      },
    });

    if (typeof note === "string" && note.trim()) {
      await retireStb(id, note);
    }
  };

  const handleBindBedModal = async (stbId: string) => {
    const note = await showAlert({
      title: "Ikat STB ke Bed",
      text: "Masukkan ID Bed tujuan:",
      input: "text",
      inputPlaceholder: "Masukkan UUID Bed (bed_id)",
      showCancelButton: true,
      confirmButtonText: "Ya, Ikat",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value.trim()) return "Bed ID wajib diisi!";
      },
    });

    if (typeof note === "string" && note.trim()) {
      await bindBed(stbId, note);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "STB" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2">
            {isFetching && <IndicatorFetching isFetching={isFetching} />}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ActionButton
              to="/app/iptv/stb/create"
              icon={PenBox}
              label="Tambah Stb"
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
              emptyMessage="Belum Ada Data Stb"
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
                    header: "STB & Serial",
                    render: (row) => (
                      <>
                        <div className="flex flex-col gap-2 text-body-content">
                          <div className="flex items-center justify-between gap-2">
                            <span className=" text-base-content">Serial</span>
                            <div className="flex items-center gap-2 text-sm">
                              {row.serial}
                              <CopyButton text={row.serial} iconOnly />
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className=" text-base-content">Source</span>
                            <div className="flex items-center gap-2 text-sm">
                              {row.serial_source}
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className=" text-base-content">Note</span>
                            <div className="flex items-center gap-2 text-sm">
                              {row.note}
                            </div>
                          </div>
                        </div>
                        {/* <div className="flex flex-col">
                          <span>
                            {row.note || "-"}{" "}
                            {row.app_version ? `(v${row.app_version})` : ""}
                          </span>
                          <div className="flex flex-row justify-between">
                            <span>{row.serial}</span>
                            <CopyButton text={row.serial} iconOnly />
                          </div>
                        </div> */}
                      </>
                    ),
                  },
                  {
                    header: "Binding",
                    render: (row) => {
                      return (
                        <div className="flex flex-col gap-2 text-body-content">
                          {row.binding ? (
                            <>
                              <div className="flex items-center justify-between gap-2">
                                <span className=" text-base-content">Bed</span>
                                <div className="flex items-center gap-2 text-sm">
                                  {row.binding?.bed_label}
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className=" text-base-content">
                                  Ruangan
                                </span>
                                <div className="flex items-center gap-2 text-sm">
                                  {row.binding?.room_label}
                                </div>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className=" text-base-content">Unit</span>
                                <div className="flex items-center gap-2 text-sm">
                                  {row.binding?.ward_name}
                                </div>
                              </div>
                            </>
                          ) : (
                            <span className="text-base-content/40">
                              Belum diikat
                            </span>
                          )}
                        </div>
                      );
                    },
                  },
                  {
                    header: "Status",
                    render: (row) => (
                      <span
                        className={`badge ${
                          row.status === "ENROLLED" || row.status === "ACTIVE"
                            ? "badge-primary"
                            : "badge-ghost"
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
                        {row.last_ip && (
                          <span className="text-caption text-base-content/50 font-mono">
                            {row.last_ip}
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
                          <div className=" ">
                            <div>{formatTimeAgo(row.last_seen_at)}</div>
                            <div>
                              {formatDateIndoWithTime(row.last_seen_at)}
                            </div>
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    ),
                  },
                  {
                    header: "Aksi",
                    render: (row) => (
                      <div className="inline-flex justify-center gap-2">
                        {/* Terbitkan Kode Enrollment */}
                        <ActionButton
                          onClick={() => createEnrollmentCode(row.id, 24)}
                          icon={KeyRound}
                          color="primary"
                          tooltip="Terbitkan Kode Enrollment"
                        />
                        <ActionButton
                          onClick={() => deleteEnrollmentCode(row.id)}
                          icon={Trash2} // Gunakan icon sesuai preferensi
                          color="error"
                          tooltip="Cabut Kode Enrollment"
                        />
                        {/* Tombol Binding / Unbind Bed */}
                        {row.binding ? (
                          <ActionButton
                            onClick={() => unbindBed(row.id)}
                            icon={Link2Off}
                            color="error"
                            tooltip="Lepas Ikat Bed"
                          />
                        ) : (
                          <ActionButton
                            to={`/app/iptv/stb/${row.id}/bind`} // Mengarah ke halaman pemilihan bed
                            icon={Link2}
                            color="success"
                            tooltip="Ikat ke Bed"
                          />
                        )}
                        {row.status === "REVOKED" ? (
                          <ActionButton
                            onClick={() => reviveStb(row.id)}
                            icon={Activity}
                            color="success"
                            tooltip="Revive Perangkat"
                          />
                        ) : (
                          <ActionButton
                            onClick={() => handleRevokeWithNote(row.id)}
                            icon={ShieldAlert}
                            color="error"
                            tooltip="Revoke Perangkat"
                          />
                        )}
                        {/* Retire / Pensiunkan dengan Catatan */}
                        <ActionButton
                          onClick={() => handleRetireWithNote(row.id)}
                          icon={ArchiveRestore}
                          color="neutral"
                          tooltip="Retire / Ganti Perangkat"
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

export default StbPage;
