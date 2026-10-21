import { useParams } from "react-router-dom";
import { Hospital, Plus, Trash2, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useContextForm } from "@patient-verification/hooks/context/use-context-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";
import ActionButton from "@/components/ActionButton";
const ContextFormPage = () => {
  const { contextId } = useParams<{ contextId: string }>();
  const isEditMode = Boolean(contextId);

  const {
    data,
    setField,
    loading,
    saving,
    handleSubmit,
    validateSchema, // Langsung panggil dari hook
    validating,
  } = useContextForm(contextId);

  // Fungsi helper untuk mengatur dynamic fields
  const handleFieldChange = (index: number, key: string, value: any) => {
    const updatedFields = [...(data.fields_schema?.fields || [])];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    };
    setField("fields_schema", { fields: updatedFields });
  };

  const handleAddField = () => {
    const updatedFields = [
      ...(data.fields_schema?.fields || []),
      {
        key: "",
        type: "text",
        label: "",
        required: false,
        placeholder: "",
        unique_identifier: false,
        display_role: "title",
      },
    ];
    setField("fields_schema", { fields: updatedFields });
  };

  const handleRemoveField = (index: number) => {
    const updatedFields = (data.fields_schema?.fields || []).filter(
      (_, i) => i !== index,
    );
    setField("fields_schema", { fields: updatedFields });
  };

  // Handler untuk tombol Validasi Schema dengan Alert Konfirmasi
  const handleValidateClick = async () => {
    await validateSchema();
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
                  label: "Context Template",
                  path: "/app/patient-verification/context",
                },
                {
                  label: isEditMode ? "Edit" : "Buat",
                },
              ]}
            />
          </div>
        </div>
      </PageTop>

      <PageMiddle>
        <Card className="flex-1 min-h-0 flex flex-col gap-6 overflow-y-auto p-4 md:p-6 h-full">
          {/* Bagian Informasi Utama */}
          <FormSection title="Data Context" icon={Hospital} color="primary">
            <div className="grid grid-cols-1 gap-4">
              <FormInput
                label="Nama Template"
                type="text"
                required
                value={data.name}
                onChange={(val) => setField("name", val)}
                placeholder="Masukkan nama template context"
              />
              <FormInput
                label="Deskripsi"
                type="text"
                required
                value={data.description}
                onChange={(val) => setField("description", val)}
                placeholder="Masukkan deskripsi template"
              />
            </div>
          </FormSection>

          {/* Bagian Fields Schema Dinamis */}
          <FormSection title="Fields Schema" icon={Plus} color="primary">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-sm text-base-content/70">
                  Atur kolom field yang dibutuhkan pada template ini.
                </span>
                <div className="flex items-center gap-2">
                  {/* Tombol Validasi dengan Alert Konfirmasi */}
                  <button
                    type="button"
                    onClick={handleValidateClick}
                    disabled={validating}
                    className="btn btn-sm btn-outline btn-primary gap-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {validating ? "Memvalidasi..." : "Validasi Schema"}
                  </button>

                  <button
                    type="button"
                    onClick={handleAddField}
                    className="btn btn-sm btn-primary gap-1"
                  >
                    <Plus className="w-4 h-4" /> Tambah Field
                  </button>
                </div>
              </div>

              <div className="divide-y divide-base-300/70 border border-base-300 rounded-lg p-3 bg-base-200/40">
                {!data.fields_schema?.fields ||
                data.fields_schema.fields.length === 0 ? (
                  <div className="text-center py-6 text-body">
                    Belum ada field ditambahkan. Klik tombol "Tambah Field" di
                    atas.
                  </div>
                ) : (
                  data.fields_schema.fields.map((field, index) => (
                    <div
                      key={index}
                      className="relative flex flex-col gap-4 py-5 px-3 first:pt-2 last:pb-2"
                    >
                      {/* Tombol Delete Sticky di Pojok Kanan Atas */}
                      <div className="absolute top-3 right-3 z-10">
                        <ActionButton
                          onClick={() => handleRemoveField(index)}
                          icon={Trash2}
                          tooltip="Hapus Field"
                          color="error"
                          className="btn-sm"
                        />
                      </div>

                      {/* Grid 5 Kolom Dinamis */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-start w-full pr-10 lg:pr-12">
                        <FormInput
                          label="Label"
                          type="text"
                          required
                          value={field.label}
                          onChange={(val) =>
                            handleFieldChange(index, "label", val)
                          }
                          placeholder="cth: Nama Pasien"
                        />

                        <FormInput
                          label="Key"
                          type="text"
                          required
                          value={field.key}
                          onChange={(val) =>
                            handleFieldChange(index, "key", val)
                          }
                          placeholder="cth: name"
                        />

                        <FormInput
                          label="Type"
                          dropdownType="select"
                          value={field.type}
                          required
                          onChange={(val) =>
                            handleFieldChange(index, "type", val)
                          }
                          options={[
                            { label: "Text", value: "text" },
                            { label: "Number", value: "number" },
                            { label: "Date", value: "date" },
                          ]}
                        />

                        <FormInput
                          label="Display Role"
                          dropdownType="select"
                          value={field.display_role || "title"}
                          required
                          onChange={(val) =>
                            handleFieldChange(index, "display_role", val)
                          }
                          options={[
                            { label: "Title", value: "title" },
                            { label: "Subtitle", value: "subtitle" },
                            { label: "Badge", value: "badge" },
                          ]}
                        />

                        <FormInput
                          label="Placeholder"
                          type="text"
                          required
                          value={field.placeholder}
                          onChange={(val) =>
                            handleFieldChange(index, "placeholder", val)
                          }
                          placeholder="cth: Citra"
                        />
                      </div>

                      {/* Checkboxes di bawah */}
                      <div className="flex flex-wrap items-center gap-6 px-1 pt-1">
                        <FormInput
                          label="Required"
                          type="checkbox"
                          value={field.required}
                          onChange={(val) =>
                            handleFieldChange(index, "required", val)
                          }
                        />

                        <FormInput
                          label="Unique ID"
                          type="checkbox"
                          value={field.unique_identifier}
                          onChange={(val) =>
                            handleFieldChange(index, "unique_identifier", val)
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
          cancelEditTo="/app/patient-verification/context"
          cancelCreateTo="/app/patient-verification/context"
        />
      </PageBottom>
    </div>
  );
};

export default ContextFormPage;
