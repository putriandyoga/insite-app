import { useParams } from "react-router-dom";
import { Tv } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useStbForm } from "@iptv/hooks/stb/use-stb-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";

const StbFormPage = () => {
  const { stbId } = useParams<{ stbId: string }>();
  const isEditMode = Boolean(stbId);

  const { data, setField, loading, saving, handleSubmit } = useStbForm(stbId);
  if (loading) return <IndicatorLoading />;

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
                {
                  label: isEditMode ? "Edit" : "Buat",
                },
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
          <FormSection title="Data STB" icon={Tv} color="primary">
            <FormInput
              label="Serial"
              type="text"
              required
              value={data.serial}
              onChange={(val) => setField("serial", val)}
              placeholder="Masukkan serial number STB"
            />
            <FormInput
              label="Note"
              type="text"
              required
              value={data.note}
              onChange={(val) => setField("note", val)}
              placeholder="Masukkan note"
            />
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/iptv/stb/${stbId}`}
          cancelCreateTo="/app/iptv/stb"
        />
      </PageBottom>
    </div>
  );
};

export default StbFormPage;
