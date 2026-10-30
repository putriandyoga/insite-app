// hooks/instances/use-instance-detail.ts
import { useState, useMemo, useEffect } from "react";
import { useInstancesDetail } from "@patient-verification/hooks/instances/use-instances-detail";
import { useInstanceVerifyNext } from "@patient-verification/hooks/instances/use-instances-verify-next";
import { useStaffMyDepartment } from "@patient-verification/hooks/staff/use-staff-my-departement";
import { getCurrentUser } from "@/utils/authHelper";

export function useInstanceDetail(
  selectedId: string | number | undefined,
  onRefreshList: () => void,
) {
  const {
    data: dataStaff,
    loading: loadingStaff,
    refetch: refetchStaff,
  } = useStaffMyDepartment();

  const [selectedStaffId, setSelectedStaffId] = useState<string | number>("");
  const [verificationNotes, setVerificationNotes] = useState("");

  const {
    data: selectedInstance,
    loading: loadingDetail,
    refetch: refetchDetail,
  } = useInstancesDetail(selectedId ? String(selectedId) : undefined);

  // Hook verifikasi lanjutan
  const { verifyNext, loading: verifying } = useInstanceVerifyNext(() => {
    onRefreshList();
    refetchDetail();
    setVerificationNotes("");
    setSelectedStaffId("");
  });

  // Reset state verifikasi setiap ganti selectedId
  useEffect(() => {
    if (selectedId) {
      setSelectedStaffId("");
      setVerificationNotes("");
      refetchDetail();
    }
  }, [selectedId, refetchDetail]);

  // Cek apakah giliran departemen user aktif
  const currentUser = getCurrentUser<any>();
  const userDepartmentId =
    currentUser?.departemen_id ||
    currentUser?.department_id ||
    currentUser?.id_department;

  const isMyTurn = useMemo(() => {
    if (!selectedInstance) return false;

    if (typeof selectedInstance.is_waiting_my_department === "boolean") {
      return selectedInstance.is_waiting_my_department;
    }

    const waitingDepts = selectedInstance.current_stage?.departments || [];
    if (waitingDepts.length === 0) return false;

    return waitingDepts.some(
      (d: any) => String(d.id || d.departemen_id) === String(userDepartmentId),
    );
  }, [selectedInstance, userDepartmentId]);

  const handleVerifySubmit = () => {
    if (!selectedId || !selectedStaffId) return;
    verifyNext(selectedId, {
      staff_id: selectedStaffId,
      notes: verificationNotes,
    });
  };

  return {
    dataStaff,
    loadingStaff,
    refetchStaff,
    selectedStaffId,
    setSelectedStaffId,
    verificationNotes,
    setVerificationNotes,
    selectedInstance,
    loadingDetail,
    verifying,
    isMyTurn,
    handleVerifySubmit,
  };
}
