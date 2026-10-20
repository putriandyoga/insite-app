import { contextService } from "@patient-verification/services/contextService";
import {
  defaultContext,
  validateContext,
  type ContextItem,
} from "@patient-verification/types/contextTypes";
import { useBaseForm } from "@/hooks/core/use-base-form";
import { queryKeys } from "@/utils/queryKeys";

export function useContextForm(contextId?: string) {
  return useBaseForm<ContextItem>({
    id: contextId,

    entityName: "Context Template",

    defaultValues: defaultContext,

    queryKey: queryKeys.context.detail(contextId || ""),

    invalidateQueryKey: queryKeys.context.lists(),

    getDetail: contextService.getDetail,

    createFn: contextService.create,

    updateFn: contextService.update,

    validate: validateContext,

    // Transform payload sebelum dikirim ke backend (baik saat create maupun update)
    transformBeforeSubmit: (data) => {
      return {
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
            display_role: field.display_role, // Sertakan jika diperlukan oleh backend
          })),
        },
      };
    },

    redirectTo: "/app/patient-verification/context",

    messages: {
      createSuccess: "Context berhasil dibuat",

      updateSuccess: "Context berhasil diperbarui",

      fetchError: "Tidak dapat mengambil data context",
    },
  });
}
