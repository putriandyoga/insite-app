import { useParams } from "react-router-dom";
import { Hospital, Plus, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { IndicatorLoading } from "@/components/IndicatorLoading";
import { useContextForm } from "@patient-verification/hooks/context/use-context-form";
import FormSection from "@/components/FormSection";
import FormInput from "@/components/FormInput";
import FormActions from "@/components/FormActions";
import Card from "@/components/Card";
import { PageBottom, PageMiddle, PageTop } from "@/components/PageLayout";

const ContextFormPage = () => {
  const { contextId } = useParams<{ contextId: string }>();
  const isEditMode = Boolean(contextId);

  const { data, setField, loading, saving, handleSubmit } =
    useContextForm(contextId);

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
              <div className="flex justify-between items-center">
                <span className="text-sm text-base-content/70">
                  Atur kolom field yang dibutuhkan pada template ini.
                </span>
                <button
                  type="button"
                  onClick={handleAddField}
                  className="btn btn-sm btn-primary gap-1"
                >
                  <Plus className="w-4 h-4" /> Tambah Field
                </button>
              </div>

              <div className="divide-y divide-base-300/70 border border-base-300 rounded-lg p-3 bg-base-200/40">
                {!data.fields_schema?.fields ||
                data.fields_schema.fields.length === 0 ? (
                  <div className="text-center py-6 text-sm text-gray-500">
                    Belum ada field ditambahkan. Klik tombol "Tambah Field" di
                    atas.
                  </div>
                ) : (
                  data.fields_schema.fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start md:items-center gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 flex-1 w-full">
                        {/* Label */}
                        <div>
                          <label className="text-xs text-base-content/60 block mb-1">
                            Label
                          </label>
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder="cth: Nama Pasien"
                            value={field.label}
                            onChange={(e) =>
                              handleFieldChange(index, "label", e.target.value)
                            }
                          />
                        </div>

                        {/* Key */}
                        <div>
                          <label className="text-xs text-base-content/60 block mb-1">
                            Key
                          </label>
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full font-mono"
                            placeholder="cth: name"
                            value={field.key}
                            onChange={(e) =>
                              handleFieldChange(index, "key", e.target.value)
                            }
                          />
                        </div>

                        {/* Type (Select) */}
                        <div>
                          <label className="text-xs text-base-content/60 block mb-1">
                            Type
                          </label>
                          <select
                            className="select select-bordered select-sm w-full"
                            value={field.type}
                            onChange={(e) =>
                              handleFieldChange(index, "type", e.target.value)
                            }
                          >
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                          </select>
                        </div>

                        {/* Display Role (Select) */}
                        <div>
                          <label className="text-xs text-base-content/60 block mb-1">
                            Display Role
                          </label>
                          <select
                            className="select select-bordered select-sm w-full"
                            value={field.display_role || "title"}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "display_role",
                                e.target.value,
                              )
                            }
                          >
                            <option value="title">Title</option>
                            <option value="subtitle">Subtitle</option>
                            <option value="badge">Badge</option>
                          </select>
                        </div>

                        {/* Placeholder */}
                        <div>
                          <label className="text-xs text-base-content/60 block mb-1">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            className="input input-bordered input-sm w-full"
                            placeholder="cth: Citra"
                            value={field.placeholder}
                            onChange={(e) =>
                              handleFieldChange(
                                index,
                                "placeholder",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        {/* Checkboxes */}
                        <div className="flex items-center gap-4 pt-5">
                          <label className="cursor-pointer label gap-2 p-0">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs checkbox-primary"
                              checked={field.required}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "required",
                                  e.target.checked,
                                )
                              }
                            />
                            <span className="text-xs">Required</span>
                          </label>

                          <label className="cursor-pointer label gap-2 p-0">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-xs checkbox-primary"
                              checked={field.unique_identifier}
                              onChange={(e) =>
                                handleFieldChange(
                                  index,
                                  "unique_identifier",
                                  e.target.checked,
                                )
                              }
                            />
                            <span className="text-xs">Unique ID</span>
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveField(index)}
                        className="btn btn-sm btn-ghost text-error self-end md:self-center mt-2 md:mt-0"
                        title="Hapus Field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
