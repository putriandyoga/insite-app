import { useParams } from "react-router-dom";
import { Hospital } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useStaffForm } from "@patient-verification/hooks/staff/use-staff-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import { useDepartementAll } from "@patient-verification/hooks/departement/use-departement-all";

const StaffFormPage = () => {
  const { staffId } = useParams<{ staffId: string }>();
  const isEditMode = Boolean(staffId);

  const { data, setField, loading, saving, handleSubmit } =
    useStaffForm(staffId);

  const { data: dataDepartement, loading: loadingDepartement } =
    useDepartementAll();

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
                  label: "Staff",
                  path: "/app/patient-verification/staff",
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
          <FormSection title="Data Staff" icon={Hospital} color="primary">
            <FormInput
              label="Employee ID"
              type="text"
              required
              value={data.employee_id}
              onChange={(val) => setField("employee_id", val)}
              placeholder="Masukkan employee ID"
            />
            <FormInput
              label="Nama"
              type="text"
              required
              value={data.name}
              onChange={(val) => setField("name", val)}
              placeholder="Masukkan nama staff"
            />
            <FormInput
              label="Departement"
              required
              options={
                Array.isArray(dataDepartement)
                  ? dataDepartement.map((item) => ({
                      label: item.name,
                      value: item.id,
                    }))
                  : []
              }
              dropdownType="select"
              value={data.departemen_id}
              onChange={(val) => setField("departemen_id", val)}
              disabled={loadingDepartement}
            />
            <FormInput
              label="Jabatan"
              type="text"
              required
              value={data.position}
              onChange={(val) => setField("position", val)}
              placeholder="Masukkan jabatan"
            />
            <FormInput
              label="Status"
              required
              options={[
                {
                  label: "Aktif",
                  value: "1",
                },
                {
                  label: "Non-Aktif",
                  value: "0",
                },
              ]}
              value={data.is_active}
              onChange={(val) => setField("is_active", val)}
              placeholder="Pilih status"
              dropdownType="select"
            />
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo={`/app/patient-verification/staff/${staffId}`}
          cancelCreateTo="/app/patient-verification/staff"
        />
      </PageBottom>
    </div>
  );
};

export default StaffFormPage;
