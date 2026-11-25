import { useState } from "react";
import { contextService } from "@patient-verification/services/contextService";
import {
  defaultContext,
  validateContext,
  type ContextItem,
} from "@patient-verification/types/contextTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";
import { showAlert } from "@/utils/showAlert";

export function useContextForm(contextId?: string) {
  const [validating, setValidating] = useState(false);

  const baseForm = useBaseForm<ContextItem>({
    id: contextId,
    entityName: "Context Template",
    defaultValues: defaultContext,
    queryKey: queryKeys.context.detail(contextId || ""),
    invalidateQueryKey: queryKeys.context.lists(),
    getDetail: contextService.getDetail,
    createFn: contextService.create,
    updateFn: contextService.update,
    validate: validateContext,
    transformBeforeSubmit: (data) => ({
      name: data.name,
      description: data.description,
      fields_schema: {
        fields: (data.fields_schema?.fields || []).map((field) => ({
          key: field.key,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          required: field.required,
          unique_identifier: field.unique_identifier,
          display_role: field.display_role,
        })),
      },
    }),
    redirectTo: "/app/patient-verification/context",
    messages: {
      createSuccess: "Context berhasil dibuat",
      updateSuccess: "Context berhasil diperbarui",
      fetchError: "Tidak dapat mengambil data context",
    },
  });

  // Override atau kustomisasi proses submit untuk menyisipkan validasi backend
  const handleCustomSubmit = async () => {
    // 1. Jalankan validasi lokal terlebih dahulu (jika ada fungsi validate dari types)
    const localErrors = validateContext ? validateContext(baseForm.data) : [];
    if (localErrors.length > 0) {
      await showAlert({
        title: "Validasi Gagal",
        html: localErrors.join("<br/>"),
        icon: "warning",
        showConfirmButton: true,
      });
      return false;
    }

    try {
      setValidating(true);

      // 2. Siapkan payload fields_schema untuk divalidasi ke backend
      const fieldsSchemaPayload = {
        fields: (baseForm.data.fields_schema?.fields || []).map((field) => ({
          key: field.key,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder,
          required: field.required,
          unique_identifier: field.unique_identifier,
          display_role: field.display_role,
        })),
      };

      // 3. Tembak endpoint validasi schema terlebih dahulu
      await contextService.validateSchema(fieldsSchemaPayload);

      // 4. Jika validasi backend BERHASIL, lanjutkan proses simpan (create/update) bawaan useBaseForm
      const success = await baseForm.handleSubmit();
      return success;
    } catch (error: any) {
      // 5. Jika validasi GAGAL, tampilkan alert error dan batalkan proses simpan
      await showAlert({
        title: "Validasi Schema Gagal",
        text:
          error?.message ||
          "Konfigurasi fields schema belum valid menurut server. Periksa kembali inputan Anda.",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "Mengerti",
      });

      return false;
    } finally {
      setValidating(false);
    }
  };

  return {
    ...baseForm,
    // Timpa fungsi handleSubmit bawaan dengan fungsi yang sudah disisipi validasi backend
    handleSubmit: handleCustomSubmit,
    validating: validating || baseForm.saving,
  };
}
