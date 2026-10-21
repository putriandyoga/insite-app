import { useState, useCallback } from "react";
import { contextService } from "@patient-verification/services/contextService";
import {
  defaultContext,
  validateContext,
  type ContextItem,
} from "@patient-verification/types/contextTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";
import { showAlert } from "@/components/Alert";

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

  // Logika validasi beserta Alert Konfirmasi dipusatkan di sini
  const handleValidateSchema = useCallback(async () => {
    // 1. Munculkan alert konfirmasi terlebih dahulu
    const confirm = await showAlert({
      title: "Validasi Schema?",
      text: "Apakah Anda ingin memvalidasi konfigurasi fields schema saat ini ke server?",
      icon: "question",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Ya, Validasi",
      cancelButtonText: "Batal",
    });

    if (!confirm) return { success: false, cancelled: true };

    try {
      setValidating(true);

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

      const result = await contextService.validateSchema(fieldsSchemaPayload);

      // 2. Alert sukses
      await showAlert({
        title: "Berhasil!",
        text: "Schema valid dan sesuai spesifikasi.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      return { success: true, data: result };
    } catch (error: any) {
      console.error("Schema validation failed:", error);

      // 3. Alert gagal
      await showAlert({
        title: "Validasi Gagal",
        text: error?.message || "Periksa kembali konfigurasi field Anda.",
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "Mengerti",
      });

      return { success: false, error };
    } finally {
      setValidating(false);
    }
  }, [baseForm.data.fields_schema]);

  return {
    ...baseForm,
    validating,
    validateSchema: handleValidateSchema,
  };
}
