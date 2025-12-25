import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courtsApi } from "@/api/courts.api";
import { queryKeys } from "@/lib/react-query";
import toast from "react-hot-toast";
import type { ApiResponse, Court } from "@/types/api.types";
import { AxiosError } from "axios";

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

export const useCreateCourt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (courtData: Partial<Court>) => {
            return await courtsApi.createCourt(courtData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courts"] });
            toast.success("Court created successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
             const message = error.response?.data?.message;
            toast.error(message || "Failed to create court");
        }
    });
};

export const useUpdateCourt = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (courtData: Partial<Court>) => {
            return await courtsApi.updateCourt(id, courtData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courts"] });
            queryClient.invalidateQueries({ queryKey: queryKeys.courts.detail(id) });
            toast.success("Court updated successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
            const message = error.response?.data?.message;
            toast.error(message || "Failed to update court");
        }
    });
};

export const useDeleteCourt = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return await courtsApi.deleteCourt(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courts"] });
            toast.success("Court deleted successfully");
        },
        onError: (error: AxiosError<ApiResponse<null>>) => {
              const message = error.response?.data?.message;
            toast.error(message || "Failed to delete court");
        }
    });
};
