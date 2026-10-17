import { useParams } from "react-router-dom";
import { Hospital } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useDepartementForm } from "@patient-verification/hooks/departement/use-departement-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";

const DepartementFormPage = () => {
  const { departementId } = useParams<{ departementId: string }>();
  const isEditMode = Boolean(departementId);

  const { data, setField, loading, saving, handleSubmit } =
    useDepartementForm(departementId);
  if (loading) return <IndicatorLoading />;

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
                {
                  label: "Departement",
                  path: "/app/patient-verification/departement",
                },
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
          <FormSection title="Data Departement" icon={Hospital} color="primary">
            <FormInput
              label="Nama"
              type="text"
              required
              value={data.name}
              onChange={(val) => setField("name", val)}
              placeholder="Masukkan nama departemen"
            />
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/patient-verification/departement/${departementId}`}
          cancelCreateTo="/app/patient-verification/departement"
        />
      </PageBottom>
    </div>
  );
};

export default DepartementFormPage;
