import { useQuery } from "@tanstack/react-query";
import { instancesService } from "@patient-verification/services/instancesService";
import { queryKeys } from "@/utils/queryKeys";

export function useInstanceMyDepartment() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.instances?.lists
      ? [...queryKeys.instances.lists(), "my-department"]
      : ["instances", "my-department"],
    queryFn: () => instancesService.getMyDepartmentInstances(),
  });

  return {
    data: data || [],
    loading: isLoading,
    error,
    refetch,
  };
}
