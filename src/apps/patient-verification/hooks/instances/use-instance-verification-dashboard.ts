// hooks/instances/useInstanceVerificationDashboard.ts
import { useState, useMemo, useEffect, useCallback } from "react";
import { useInstanceMyDepartment } from "@patient-verification/hooks/instances/use-instances-my-departement";
import { useInstancesDetail } from "@patient-verification/hooks/instances/use-instances-detail";
import { useInstanceVerifyNext } from "@patient-verification/hooks/instances/use-instances-verify-next";
import { useStaffMyDepartment } from "@patient-verification/hooks/staff/use-staff-my-departement";
import { getCurrentUser } from "@/utils/authHelper";

export function useInstanceVerificationDashboard() {
  const {
    data: dataInstance,
    loading: loadingInstance,
    refetch: refetchInstance,
  } = useInstanceMyDepartment();

  const {
    data: dataStaff,
    loading: loadingStaff,
    refetch: refetchStaff,
  } = useStaffMyDepartment();

  // Paksa refresh data begitu halaman dibuka / berganti sesi
  useEffect(() => {
    refetchInstance();
    refetchStaff();
  }, [refetchInstance, refetchStaff]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    undefined,
  );

  // State form verifikasi
  const [selectedStaffId, setSelectedStaffId] = useState<string | number>("");
  const [verificationNotes, setVerificationNotes] = useState("");

  const {
    data: selectedInstance,
    loading: loadingDetail,
    refetch: refetchDetail,
  } = useInstancesDetail(selectedId ? String(selectedId) : undefined);

  // Hook verifikasi lanjutan
  const { verifyNext, loading: verifying } = useInstanceVerifyNext(() => {
    refetchInstance();
    refetchDetail();
    setVerificationNotes("");
  });

  // Filter pencarian data instance pasien
  const filteredData = useMemo(() => {
    if (!dataInstance) return [];
    return dataInstance.filter((item: any) => {
      const query = searchQuery.toLowerCase();
      const name = (
        item.context_data?.name ||
        item.ticket_code ||
        ""
      ).toLowerCase();
      const rm = (item.context_data?.medical_record || "").toLowerCase();
      return name.includes(query) || rm.includes(query);
    });
  }, [dataInstance, searchQuery]);

  // Handler pilih item pasien
  const handleSelectInstance = useCallback(
    (id: string | number) => {
      setSelectedId(id);
      setSelectedStaffId("");
      setVerificationNotes("");
      setTimeout(() => {
        refetchDetail();
      }, 50);
    },
    [refetchDetail],
  );

  // Handler submit verifikasi
  const handleVerifySubmit = () => {
    if (!selectedId || !selectedStaffId) return;
    verifyNext(selectedId, {
      staff_id: selectedStaffId,
      notes: verificationNotes,
    });
  };

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

  return {
    dataInstance,
    loadingInstance,
    dataStaff,
    loadingStaff,
    searchQuery,
    setSearchQuery,
    selectedId,
    selectedStaffId,
    setSelectedStaffId,
    verificationNotes,
    setVerificationNotes,
    selectedInstance,
    loadingDetail,
    verifying,
    filteredData,
    isMyTurn,
    handleSelectInstance,
    handleVerifySubmit,
  };
}
