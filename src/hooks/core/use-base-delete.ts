import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import type { DaisyColor } from "@/utils/color";
import { defaultCrudMessages, type CrudMessages } from "@/utils/crudMessages";
import { handleApiError } from "@/utils/errorHandler";
import { showAlert } from "@/components/Alert";

interface UseBaseDeleteProps {
  mutationFn: (id: string | number) => Promise<void>;
  invalidateQueryKey?: readonly unknown[];
  entityName?: string;
  redirectTo?: string;
  onSuccess?: () => void | Promise<void>;
  messages?: CrudMessages;
}

export function useBaseDelete({
  mutationFn,
  invalidateQueryKey,
  entityName = "data",
  redirectTo,
  onSuccess,
  messages,
}: UseBaseDeleteProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const msg = useMemo(
    () => ({
      ...defaultCrudMessages(entityName),
      ...messages,
    }),
    [entityName, messages],
  );

  const mutation = useMutation({
    mutationFn,
    onSuccess: async () => {
      if (invalidateQueryKey) {
        await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }
      if (onSuccess) {
        await onSuccess();
      }
      if (redirectTo) {
        navigate(redirectTo);
      }

      await showAlert({
        title: msg.successTitle,
        text: msg.deleteSuccess,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    },
    onError: async (err) => {
      await handleApiError(err, msg.deleteError);
    },
  });

  const handleDelete = async (id: string | number) => {
    const result = await showAlert({
      title: msg.deleteConfirmTitle,
      text: msg.deleteConfirmText,
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: "Hapus",
      confirmButtonColor: "error" as DaisyColor,
      cancelButtonText: "Batal",
    });

    if (!result) return;

    mutation.mutate(id);
  };

  return {
    loading: mutation.isPending,
    handleDelete,
  };
}
