import { useParams } from "react-router-dom";
import { Hospital, Plus, X, Workflow } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useProcessForm } from "@patient-verification/hooks/process/use-process-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import ActionButton from "@/components/ActionButton";
import FormActions from "@/components/FormActions";
import { useDepartementAll } from "@patient-verification/hooks/departement/use-departement-all";
import { useContextAll } from "@patient-verification/hooks/context/use-context-all";

const ProcessFormPage = () => {
  const { processId } = useParams<{ processId: string }>();
  const isEditMode = Boolean(processId);

  const { data, setField, loading, saving, handleSubmit } =
    useProcessForm(processId);
  const { data: dataDepartement, loading: loadingDepartement } =
    useDepartementAll();
  const { data: dataContext, loading: loadingContext } = useContextAll();

  // Fungsi helper untuk mengatur field umum pada stage
  const handleStageChange = (index: number, key: string, value: any) => {
    const updatedStages = [...(data.stages || [])];
    updatedStages[index] = {
      ...updatedStages[index],
      [key]: value,
    };
    setField("stages", updatedStages);
  };

  // Fungsi helper untuk mengatur departemen dan is_mandatory di dalam stage
  const handleStageDeptChange = (
    stageIndex: number,
    key: string,
    value: any,
  ) => {
    const updatedStages = [...(data.stages || [])];
    const currentDept = updatedStages[stageIndex].departments?.[0] || {
      departemen_id: "",
      is_mandatory: true,
    };

    updatedStages[stageIndex] = {
      ...updatedStages[stageIndex],
      departments: [
        {
          ...currentDept,
          [key]: value,
        },
      ],
    };
    setField("stages", updatedStages);
  };

  const handleAddStage = () => {
    const currentStages = data.stages || [];
    const updatedStages = [
      ...currentStages,
      {
        id: 0, // Ditambahkan agar memenuhi tipe data Stages
        stage_name: "",
        stage_order: currentStages.length + 1,
        description: "",
        is_required: true,
        departments: [
          {
            id: 0, // Ditambahkan agar memenuhi tipe StageDepartmentItem
            departemen_id: "" as any, // Di-cast agar tidak error tipe number
            departemen_name: "",
            is_mandatory: true,
          },
        ],
      },
    ];
    setField("stages", updatedStages as any);
  };

  const handleRemoveStage = (index: number) => {
    const updatedStages = (data.stages || [])
      .filter((_, i) => i !== index)
      .map((stage, idx) => ({
        ...stage,
        stage_order: idx + 1, // Otomatis merapikan ulang urutan order
      }));
    setField("stages", updatedStages);
  };

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
                  label: "Process Template",
                  path: "/app/patient-verification/process",
                },
                {
                  label: isEditMode ? "Edit Process" : "Buat Process",
                },
              ]}
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto p-4 md:p-6 h-full">
          {/* Bagian Informasi Utama Process */}
          <FormSection title="Data Process" icon={Hospital} color="primary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Nama Proses"
                type="text"
                required
                value={data.name || ""}
                onChange={(val) => setField("name", val)}
                placeholder="Masukkan nama proses"
              />

              {/* Dropdown Context Template */}
              <FormInput
                label="Context Template"
                dropdownType="select"
                required
                value={data.context_template_id || ""}
                onChange={(val) =>
                  setField("context_template_id", val ? val : "")
                }
                options={
                  Array.isArray(dataContext)
                    ? dataContext.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))
                    : []
                }
                disabled={loadingContext}
              />

              <div className="md:col-span-2">
                <FormInput
                  label="Deskripsi"
                  type="text"
                  required
                  value={data.description || ""}
                  onChange={(val) => setField("description", val)}
                  placeholder="Masukkan deskripsi proses"
                />
              </div>
            </div>
          </FormSection>

          {/* Bagian Daftar Stages Dinamis */}
          <FormSection title="Daftar Stages" icon={Workflow} color="primary">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content/70">
                  Atur tahapan (stages) dan departemen yang bertanggung jawab
                  pada proses ini.
                </span>

                <ActionButton
                  onClick={handleAddStage}
                  icon={Plus}
                  label="Tambah Stage"
                  color="primary"
                  className="btn-sm"
                />
              </div>

              <div className="divide-y divide-base-300/70 border border-base-300 rounded-lg p-3 bg-base-200/40">
                {!data.stages || data.stages.length === 0 ? (
                  <div className="text-center py-6 text-body">
                    Belum ada stage ditambahkan. Klik tombol "Tambah Stage" di
                    atas.
                  </div>
                ) : (
                  data.stages.map((stage, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col gap-4 py-5 px-3 first:pt-2 last:pb-2 border-b border-base-300/60 last:border-b-0"
                    >
                      {/* Tombol Hapus Stage */}
                      <div className="absolute top-3 right-3 z-10">
                        <ActionButton
                          onClick={() => handleRemoveStage(index)}
                          icon={X}
                          tooltip="Hapus Stage"
                          color="error"
                          className="btn-sm"
                        />
                      </div>

                      {/* Baris Input Utama Stage */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-start w-full pr-10 lg:pr-12">
                        {/* Nama Tahap */}
                        <FormInput
                          label={`Tahap #${stage.stage_order || index + 1} - Nama Tahap`}
                          type="text"
                          required
                          value={stage.stage_name || ""}
                          onChange={(val) =>
                            handleStageChange(index, "stage_name", val)
                          }
                          placeholder="cth: Order Masuk"
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
                          value={stage.departments?.[0]?.departemen_id || ""}
                          onChange={(val) =>
                            handleStageDeptChange(
                              index,
                              "departemen_id",
                              val ? Number(val) : "",
                            )
                          }
                          disabled={loadingDepartement}
                        />

                        {/* Deskripsi Tahap */}
                        <FormInput
                          label="Deskripsi Tahap"
                          type="text"
                          value={stage.description || ""}
                          onChange={(val) =>
                            handleStageChange(index, "description", val)
                          }
                          placeholder="Deskripsi opsional"
                        />
                      </div>

                      {/* Baris Checkbox (Required & Mandatory Dept) */}
                      <div className="flex items-center gap-8 px-1 pt-1 bg-base-100/50 p-3 rounded-md">
                        <FormInput
                          label="Stage Required"
                          type="checkbox"
                          value={stage.is_required ?? true}
                          onChange={(val) =>
                            handleStageChange(index, "is_required", val)
                          }
                        />

                        <FormInput
                          label="Mandatory Dept"
                          type="checkbox"
                          value={stage.departments?.[0]?.is_mandatory ?? true}
                          onChange={(val) =>
                            handleStageDeptChange(index, "is_mandatory", val)
                          }
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </FormSection>
        </Card>
      </PageMiddle>

      <PageBottom>
        <FormActions
          onSubmit={handleSubmit}
          saving={saving}
          isEditMode={isEditMode}
          cancelEditTo="/app/patient-verification/process"
          cancelCreateTo="/app/patient-verification/process"
        />
      </PageBottom>
    </div>
  );
};

export default ProcessFormPage;
