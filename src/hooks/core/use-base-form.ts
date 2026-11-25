import { useMemo, useState, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { defaultCrudMessages, type CrudMessages } from "@/utils/crudMessages";
import { showAlert } from "@/utils/showAlert";
import { handleApiError } from "@/utils/errorHandler";

interface UseBaseFormProps<T> {
  id?: string | number;
  entityName?: string;
  defaultValues: T;
  queryKey?: readonly unknown[];
  invalidateQueryKey?: readonly unknown[];
  getDetail?: (id: string) => Promise<T>;
  createFn: (data: Partial<T>) => Promise<T>;
  updateFn: (id: string | number, data: Partial<T>) => Promise<T>;
  validate?: (data: T) => string[];
  redirectTo?: string | ((data: any) => string);
  transformBeforeSubmit?: (data: T) => Partial<T>;
  messages?: CrudMessages;
}

export function useBaseForm<T>({
  id,
  entityName = "data",
  defaultValues,
  queryKey,
  invalidateQueryKey,
  getDetail,
  createFn,
  updateFn,
  validate,
  redirectTo,
  transformBeforeSubmit,
  messages,
}: UseBaseFormProps<T>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEdit = Boolean(id);

  const [data, setData] = useState<T>(defaultValues);
  const defaultValuesRef = useRef<T>(defaultValues);
  const hydratedIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    defaultValuesRef.current = defaultValues;
  }, [defaultValues]);

  useEffect(() => {
    if (!id) {
      hydratedIdRef.current = null;
    }
  }, [id]);

  const msg = useMemo(
    () => ({
      ...defaultCrudMessages(entityName),
      ...messages,
    }),
    [entityName, messages],
  );

  const detailQuery = useQuery({
    queryKey: [...(queryKey ?? []), id],
    queryFn: async () => {
      if (!id || !getDetail)
        throw new Error("ID atau getDetail tidak tersedia");
      return getDetail(String(id));
    },
    enabled: Boolean(id && getDetail),
  });

  useEffect(() => {
    if (id && detailQuery.data && hydratedIdRef.current !== id) {
      hydratedIdRef.current = id;
      setData({
        ...defaultValuesRef.current,
        ...detailQuery.data,
      });
    }
  }, [id, detailQuery.data]);

  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const setFields = (values: Partial<T>) => {
    setData((prev) => ({ ...prev, ...values }));
  };

  const resetForm = () => {
    hydratedIdRef.current = null;
    setData(defaultValuesRef.current);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = transformBeforeSubmit
        ? transformBeforeSubmit(data)
        : data;
      if (isEdit && id) {
        return updateFn(id, payload);
      }
      return createFn(payload);
    },
    onSuccess: async (responseData) => {
      if (queryKey) {
        await queryClient.invalidateQueries({ queryKey });
      }
      if (invalidateQueryKey) {
        await queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
      }

      await showAlert({
        title: msg.successTitle,
        text: isEdit ? msg.updateSuccess : msg.createSuccess,
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      if (redirectTo) {
        const destination =
          typeof redirectTo === "function"
            ? redirectTo(responseData)
            : redirectTo;
        navigate(destination);
      }
    },
    onError: async (err) => {
      await handleApiError(err, isEdit ? msg.updateError : msg.createError);
    },
  });

  const handleSubmit = async () => {
    const errors = validate?.(data) || [];
    if (errors.length > 0) {
      await showAlert({
        title: msg.validationTitle,
        html: errors.join("<br/>"),
        icon: "warning",
        showConfirmButton: true,
      });
      return false;
    }

    try {
      await mutation.mutateAsync();
      return true;
    } catch (submitError) {
      console.warn("Submit form gagal:", submitError);
      return false;
    }
  };

  return {
    data,
    loading: detailQuery.isLoading,
    saving: mutation.isPending,
    error: detailQuery.isError,
    isEdit,
    setData,
    setField,
    setFields,
    resetForm,
    handleSubmit,
    refetch: detailQuery.refetch,
    mutation,
  };
}
