import { useParams } from "react-router-dom";
import { Hospital } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useWardForm } from "@iptv/hooks/master/ward/use-ward-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";

const WardFormPage = () => {
  const { wardId } = useParams<{ wardId: string }>();
  const isEditMode = Boolean(wardId);

  const { data, setField, loading, saving, handleSubmit } = useWardForm(wardId);
  if (loading) return <IndicatorLoading />;

  return (
    <div className="flex flex-col gap-4 max-w-full">
      {/* Header */}
      <div>
        <Breadcrumb
          items={[
            { label: "Home", path: "/dashboard" },
            { label: "Dashboard", path: "/queue/dashboard" },
            { label: "Ruang Perawatan", path: "/queue/ward" },
            {
              label: isEditMode
                ? "Edit Data Ruang Perawatan"
                : "Buat Data Ruang Perawatan",
            },
          ]}
        />
      </div>
      <FormSection title="Data Ruang Perawatan" icon={Hospital} color="primary">
        <FormInput
          label="Nama"
          type="text"
          required
          value={data.name}
          onChange={(val) => setField("name", val)}
          placeholder="Masukkan nama ruang perawatan"
        />
      </FormSection>

      <Card>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/queue/ward/${wardId}`}
          cancelCreateTo="/queue/ward/create"
        />
      </Card>
    </div>
  );
};

export default WardFormPage;
