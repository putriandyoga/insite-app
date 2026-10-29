// hooks/staff/use-staff-my-departement.ts
import { useQuery } from "@tanstack/react-query";
import { staffService } from "@patient-verification/services/staffService";
import { queryKeys } from "@/utils/queryKeys";
import { getCurrentUser } from "@/utils/authHelper"; // Sesuaikan dengan helper auth Anda untuk mengambil data user aktif

export function useStaffMyDepartment() {
  // Ambil ID departemen dari user yang sedang login saat ini
  const currentUser = getCurrentUser<any>();
  const departmentId =
    currentUser?.departemen_id || currentUser?.department_id || "default";

  const { data, isLoading, error, refetch } = useQuery({
    // Masukkan departmentId ke dalam queryKey agar cache unik per departemen/akun
    queryKey: queryKeys.staff?.lists
      ? [...queryKeys.staff.lists(), departmentId]
      : ["staff", "lists", departmentId],
    queryFn: () => staffService.getMyDepartment(),
    // Opsional: Pastikan data dianggap stale/basi agar langsung fetch ulang saat komponen dipasang
    staleTime: 0,
  });

  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch,
  };
}
