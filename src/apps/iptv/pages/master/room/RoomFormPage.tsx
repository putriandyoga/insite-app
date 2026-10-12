import { useState } from "react";
import { useParams } from "react-router-dom";
import { DoorClosed, X } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useRoomForm } from "@iptv/hooks/master/room/use-room-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { useWardList } from "@/apps/iptv/hooks/master/ward/use-ward-list";

const RoomFormPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const isEditMode = Boolean(roomId);

  const { data, setField, loading, saving, handleSubmit } = useRoomForm(roomId);

  // Panggil useWardList di atas sebelum pengecekan loading agar urutan hook konsisten
  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );

  // State lokal untuk menampung teks input bed yang sedang diketik
  const [bedInput, setBedInput] = useState("");

  if (loading || loadingWards) return <IndicatorLoading />;

  // Handler untuk menambah bed saat menekan Enter atau Koma
  const handleBedKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmedValue = bedInput.trim();
      if (trimmedValue) {
        const currentBeds = Array.isArray(data.beds) ? data.beds : [];
        // Cek agar tidak duplikat
        if (!currentBeds.includes(trimmedValue)) {
          setField("beds", [...currentBeds, trimmedValue] as any);
        }
        setBedInput("");
      }
    }
  };

  // Handler untuk menghapus bed yang sudah dipilih
  const handleRemoveBed = (bedToRemove: string) => {
    const currentBeds = Array.isArray(data.beds) ? data.beds : [];
    setField("beds", currentBeds.filter((b) => b !== bedToRemove) as any);
  };

  return (
    <div className="flex flex-col gap-4 max-w-full">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Home", path: "/dashboard" },
            { label: "Dashboard", path: "/app/iptv/dashboard" },
            { label: "Ruangan", path: "/app/iptv/room" },
            {
              label: isEditMode ? "Edit" : "Buat",
            },
          ]}
        />
      </div>

      <FormSection title="Data Ruangan" icon={DoorClosed} color="primary">
        {/* Pilihan Ward / Ruang Perawatan */}
        <FormInput
          label="Ruang Perawatan"
          required
          options={
            Array.isArray(wardList)
              ? wardList.map((item) => ({
                  label: item.name,
                  value: item.id,
                }))
              : []
          }
          dropdownType="select"
          value={data.ward_id}
          onChange={(val) => setField("ward_id", val)}
          disabled={loadingWards}
        />

        {/* Input Label Ruangan */}
        <FormInput
          label="Label Ruangan"
          type="text"
          required
          value={data.label}
          onChange={(val) => setField("label", val)}
          placeholder="Masukkan label ruangan (Contoh: 101)"
        />

        {/* Input Beds Interaktif dengan Border Primary saat Fokus */}
        {/* Input Beds Interaktif dengan Border Primary saat Fokus */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-base-content">
            Daftar Bed <span className="text-error">*</span>
          </label>

          <div className="input input-bordered flex items-center flex-wrap gap-2 h-auto min-h-12 py-2 rounded-xl w-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary focus-within:outline-none focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            {Array.isArray(data.beds) &&
              data.beds.map((bed, index) => (
                <span
                  key={index}
                  className="badge badge-primary gap-1 px-3 py-2 text-sm"
                >
                  {bed}
                  <button
                    type="button"
                    onClick={() => handleRemoveBed(bed)}
                    className="hover:bg-primary-focus rounded-full p-0.5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}

            <input
              type="text"
              value={bedInput}
              onChange={(e) => setBedInput(e.target.value)}
              onKeyDown={handleBedKeyDown}
              placeholder={
                data.beds?.length
                  ? "Ketik lalu tekan Enter..."
                  : "Ketik lalu tekan Enter (Contoh: A, B, C)"
              }
              className="grow outline-none bg-transparent border-none focus:outline-none focus:ring-0 text-base-content placeholder:text-base-content/40 text-sm py-1 shadow-none"
            />
          </div>
          <span className="text-caption">
            Tekan <b>Enter</b> atau koma (<b>,</b>) setelah mengetik nama/nomor
            bed untuk menambahkannya.
          </span>
        </div>
      </FormSection>

      <Card>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/iptv/room/${roomId}`}
          cancelCreateTo="/app/iptv/room"
        />
      </Card>
    </div>
  );
};

export default RoomFormPage;
