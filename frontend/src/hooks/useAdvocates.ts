import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { advocatesApi } from "@/api/advocates.api";
import { queryKeys } from "@/lib/react-query";
import toast from "react-hot-toast";
import type { ApiResponse, Advocate } from "@/types/api.types";
import { AxiosError } from "axios";

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

export const useCreateAdvocate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (advocateData: Partial<Advocate>) => {
            return await advocatesApi.createAdvocate(advocateData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advocates"] });
            toast.success("Advocate registered successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            const message = error.response?.data?.message;
            toast.error(message || "Failed to register advocate");
        }
    });
};

export const useUpdateAdvocate = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (advocateData: Partial<Advocate>) => {
            return await advocatesApi.updateAdvocate(id, advocateData);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["advocates"] });
             queryClient.invalidateQueries({ queryKey: queryKeys.advocates.detail(id) });
             toast.success("Advocate updated successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            const message = error.response?.data?.message;
            toast.error(message || "Failed to update advocate");
        }
    });
};

export const useDeleteAdvocate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await advocatesApi.deleteAdvocate(id);
        },
         onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["advocates"] });
            toast.success("Advocate removed successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            const message = error.response?.data?.message;
            toast.error(message || "Failed to remove advocate");
        }
    });
};
