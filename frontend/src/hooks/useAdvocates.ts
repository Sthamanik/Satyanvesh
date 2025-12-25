import { useQuery } from "@tanstack/react-query";
import { advocatesApi } from "@/api/advocates.api";
import { queryKeys } from "@/lib/react-query";

export const useGetAdvocates = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.advocates.all(params),
    queryFn: () => advocatesApi.getAllAdvocates(params),
  });
};

export const useGetAdvocateById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.advocates.detail(id),
    queryFn: () => advocatesApi.getAdvocateById(id),
    enabled: !!id,
  });
};
