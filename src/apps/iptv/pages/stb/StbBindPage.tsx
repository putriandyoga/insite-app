import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2, CheckCircle2, DoorOpen } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import FormSection from "@/components/FormSection";
import FormActions from "@/components/FormActions";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useStbBindBed } from "@iptv/hooks/stb/use-stb-bind-bed";
import { useBedList } from "@iptv/hooks/master/bed/use-bed-list";
import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
import { showAlert } from "@/components/Alert";
import { useStbDetail } from "@iptv/hooks/stb/use-stb-detail";
import DataSection from "@/components/DataSection";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import { StbHeaderCard } from "../../components/StbHeaderCard";

const StbBindPage = () => {
  const { stbId } = useParams<{ stbId: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useStbDetail(stbId);

  // State untuk filter Ward dan Bed yang dipilih
  const [selectedWardId, setSelectedWardId] = useState("");
  const [selectedBedId, setSelectedBedId] = useState("");

  // Ambil daftar Ward
  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );

  // Ambil daftar Bed berdasarkan ward yang dipilih
  const { data: bedList, loading: bedLoading } = useBedList(
    1,
    {
      ward_id: selectedWardId,
      status: "ACTIVE",
    },
    500,
  );

  // Grouping bed berdasarkan Ruangan (room_id / room_label)
  const groupedBeds = useMemo(() => {
    if (!Array.isArray(bedList)) return {};

    return bedList.reduce((acc: Record<string, any[]>, bed: any) => {
      const roomKey =
        bed.room_label ||
        bed.room_name ||
        `Ruangan ${bed.room_id || "Lainnya"}`;
      if (!acc[roomKey]) {
        acc[roomKey] = [];
      }
      acc[roomKey].push(bed);
      return acc;
    }, {});
  }, [bedList]);

  // Hook bind bed
  const { bindBed, loading: saving } = useStbBindBed(() => {
    navigate("/app/iptv/stb");
  });

  const handleSubmit = async () => {
    if (!stbId) return;

    if (!selectedBedId) {
      await showAlert({
        title: "Peringatan",
        text: "Silakan pilih bed terlebih dahulu sebelum mengikat STB.",
        icon: "warning",
        showConfirmButton: true,
      });
      return;
    }

    bindBed(stbId, selectedBedId);
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
                { label: "STB", path: "/app/iptv/stb" },
                { label: "Ikat ke Bed" },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="h-9"></div>
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
              emptyMessage="Belum Ada Data User"
            />

            {!loading && !error && data && <StbHeaderCard data={data} />}
            <FormSection
              title="Pilih Bed Perawatan Tujuan"
              icon={Link2}
              color="primary"
            >
              <div className="flex flex-col gap-6">
                {/* Step 1: Pilih Ward */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-base-content">
                    1. Pilih Ruang Perawatan
                    <span className="text-error">*</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedWardId}
                    onChange={(e) => {
                      setSelectedWardId(e.target.value);
                      setSelectedBedId(""); // Reset pilihan bed jika ward diganti
                    }}
                    disabled={loadingWards}
                  >
                    <option value="">Pilih Ward / Ruang Perawatan</option>
                    {Array.isArray(wardList) &&
                      wardList.map((ward: any) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Step 2: Denah Pemilihan Bed */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-base-content">
                      2. Pilih Bed dari Denah Ruangan{" "}
                      <span className="text-error">*</span>
                    </label>

                    {/* Legend / Keterangan Warna */}
                    <div className="flex items-center gap-4 text-xs text-base-content/70">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-md bg-base-200 border border-base-300"></div>
                        <span>Tersedia</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-md bg-primary"></div>
                        <span>Dipilih</span>
                      </div>
                    </div>
                  </div>

                  {!selectedWardId ? (
                    <div className="p-8 text-center border-2 border-dashed border-base-300 rounded-2xl bg-base-200/30 text-base-content/60">
                      Silakan pilih <b>Ward (Ruang Perawatan)</b> terlebih
                      dahulu di atas untuk menampilkan denah bed.
                    </div>
                  ) : bedLoading ? (
                    <div className="py-12 flex justify-center">
                      <IndicatorLoading />
                    </div>
                  ) : Object.keys(groupedBeds).length === 0 ? (
                    <div className="p-8 text-center border border-base-300 rounded-2xl bg-base-200/30 text-base-content/60">
                      Tidak ada data bed yang aktif pada Ward ini.
                    </div>
                  ) : (
                    /* Container Utama Denah dengan style grid card ruangan */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-base-300 rounded-2xl bg-base-200/20 max-h-137.5 overflow-y-auto">
                      {Object.entries(groupedBeds).map(([roomName, beds]) => (
                        <div
                          key={roomName}
                          className="flex flex-col gap-3 p-4 bg-base-100 rounded-2xl border border-base-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Header Nama Ruangan dengan Badge/Icon */}
                          <div className="flex items-center gap-2 pb-2 border-b border-base-300 text-primary font-bold text-sm">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/40 text-base-content">
                              <DoorOpen className="h-4 w-4" />
                            </div>
                            <span>{roomName}</span>
                          </div>

                          {/* Grid Kotak Bed ala Bioskop yang Compact */}
                          <div className="grid grid-cols-4 gap-2">
                            {beds.map((bed: any) => {
                              const isSelected = selectedBedId === bed.id;
                              const bedLabel =
                                bed.bed_label || bed.label || bed.name;

                              return (
                                <button
                                  key={bed.id}
                                  type="button"
                                  onClick={() => setSelectedBedId(bed.id)}
                                  className={`relative overflow-visible flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border transition-all duration-150 hover:scale-[1.03] active:scale-95 ${
                                    isSelected
                                      ? "bg-primary text-primary-content border-primary shadow-md font-bold scale-[1.02]"
                                      : "bg-base-200/60 hover:bg-base-200 text-base-content border-base-300"
                                  }`}
                                >
                                  <span className="text-[10px] uppercase tracking-wider opacity-70">
                                    Bed
                                  </span>
                                  <span className="text-sm font-extrabold">
                                    {bedLabel}
                                  </span>

                                  {isSelected && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-content shadow-sm border border-base-100">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </FormSection>
          </div>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={false}
          cancelEditTo="/app/iptv/stb"
          cancelCreateTo="/app/iptv/stb"
        />
      </PageBottom>
    </div>
  );
};

export default StbBindPage;
