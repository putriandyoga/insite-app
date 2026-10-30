// hooks/dashboard/use-admin-instance-modal.ts
import { useState } from "react";

export function useAdminInstanceModal(
  instanceDetail: any,
  selectedInstance: any,
) {
  const [isUpdateContextModalOpen, setIsUpdateContextModalOpen] =
    useState(false);
  const [editContextData, setEditContextData] = useState<Record<string, any>>(
    {},
  );
  const [changeReason, setChangeReason] = useState("");

  const handleOpenUpdateContextModal = () => {
    const currentContext =
      instanceDetail?.context_data || selectedInstance?.context_data;
    if (currentContext) {
      setEditContextData({ ...currentContext });
    }
    setChangeReason("");
    setIsUpdateContextModalOpen(true);
  };

  const handleCloseUpdateContextModal = () => {
    setIsUpdateContextModalOpen(false);
  };

  const contextFields =
    instanceDetail?.context_template?.fields ||
    selectedInstance?.context_template?.fields ||
    [];

  return {
    isUpdateContextModalOpen,
    editContextData,
    setEditContextData,
    changeReason,
    setChangeReason,
    handleOpenUpdateContextModal,
    handleCloseUpdateContextModal,
    contextFields,
  };
}
