import { useQuery } from "@tanstack/react-query";
import { courtsApi } from "@/api/courts.api";
import { queryKeys } from "@/lib/react-query";

export const useGetCourts = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.courts.all(params),
    queryFn: () => courtsApi.getAllCourts(params),
  });
};

export const useGetCourtById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.courts.detail(id),
    queryFn: () => courtsApi.getCourtById(id),
    enabled: !!id,
  });
};
