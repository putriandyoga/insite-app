import { useParams } from "react-router-dom";
import { Tv } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useStationForm } from "@iptv/hooks/station/use-station-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { useWardList } from "@iptv/hooks/master/ward/use-ward-list";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";

const StationFormPage = () => {
  const { stationId } = useParams<{ stationId: string }>();
  const isEditMode = Boolean(stationId);

  const { data, setField, loading, saving, handleSubmit } =
    useStationForm(stationId);

  const { data: wardList, loading: loadingWards } = useWardList(
    1,
    undefined,
    1000,
  );

  if (loading || loadingWards) return <IndicatorLoading />;

  return (
    <div className="flex flex-col h-full max-w-full gap-3 overflow-hidden">
      <PageTop>
        <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 w-full py-1">
          <div className="overflow-x-auto min-w-0">
            <Breadcrumb
              items={[
                { label: "Home", path: "/dashboard" },
                { label: "Dashboard", path: "/app/iptv/dashboard" },
                { label: "Ruangan", path: "/app/iptv/station" },
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
          <FormSection title="Data Station" icon={Tv} color="primary">
            <FormInput
              label="Nama Station"
              type="text"
              required
              value={data.name}
              onChange={(val) => setField("name", val)}
              placeholder="Masukkan station"
            />
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
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/iptv/station/${stationId}`}
          cancelCreateTo="/app/iptv/station"
        />
      </PageBottom>
    </div>
  );
};

export default StationFormPage;
