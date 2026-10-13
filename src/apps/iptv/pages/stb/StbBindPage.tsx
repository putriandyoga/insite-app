import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2, Tv } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import Card from "@/components/Card";
import FormSection from "@/components/FormSection";
import FormActions from "@/components/FormActions";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useStbBindBed } from "@iptv/hooks/stb/use-stb-bind-bed";
import { useBedList } from "../../hooks/master/bed/use-bed-list";
import { showAlert } from "@/components/Alert";

const StbBindPage = () => {
  const { stbId } = useParams<{ stbId: string }>();
  const navigate = useNavigate();

  // State untuk menyimpan bed_id yang dipilih
  const [selectedBedId, setSelectedBedId] = useState("");

  // Ambil daftar bed (mengambil hingga 500 data untuk mengakomodasi seluruh bed)
  const { data: bedList, loading: bedLoading } = useBedList(1, undefined, 500);

  // Hook bind bed
  const { bindBed, loading: saving } = useStbBindBed(() => {
    navigate("/app/iptv/stb");
  });

  if (bedLoading) return <IndicatorLoading />;

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
    <div className="flex flex-col gap-4 max-w-full">
      {/* Header Breadcrumb */}
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
      </div>

      {/* Info Perangkat STB yang sedang dipilih */}
      {/* {stbDetail && (
        <Card className="p-4 bg-base-200/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl border border-base-300 bg-primary/10 text-primary">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content flex items-center gap-2">
                Serial: {stbDetail.serial}
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-primary/15 text-primary">
                  {stbDetail.status}
                </span>
              </h2>
              <p className="text-xs text-base-content/60">
                Note:{" "}
                <span className="font-medium text-base-content">
                  {stbDetail.note || "-"}
                </span>
              </p>
            </div>
          </div>
        </Card>
      )} */}

      {/* Form Pemilihan Bed */}
      <FormSection
        title="Pilih Bed Perawatan Tujuan"
        icon={Link2}
        color="primary"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-base-content">
            Cari & Pilih Bed <span className="text-error">*</span>
          </label>

          <select
            className="select select-bordered w-full"
            value={selectedBedId}
            onChange={(e) => setSelectedBedId(e.target.value)}
          >
            <option value="" disabled>
              -- Pilih Bed Tujuan --
            </option>
            {Array.isArray(bedList) &&
              bedList.map((bed: any) => (
                <option key={bed.id} value={bed.id}>
                  Bed {bed.bed_label || bed.name} — Ruangan{" "}
                  {bed.room_label || bed.room_name} (Unit: {bed.ward_name})
                </option>
              ))}
          </select>
          <span className="text-xs text-base-content/50 mt-1">
            Pilih bed yang sesuai berdasarkan Unit (Ward), Ruangan, dan Label
            Bed.
          </span>
        </div>
      </FormSection>

      <Card>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={false}
          cancelEditTo="/app/iptv/stb"
          cancelCreateTo="/app/iptv/stb"
        />
      </Card>
    </div>
  );
};

export default StbBindPage;
