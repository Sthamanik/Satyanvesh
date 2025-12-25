import axiosInstance from "@/lib/axios";
import type { ApiResponse, Court, PaginationParams } from "@/types/api.types";

export const courtsApi = {
  getAllCourts: async (
    params?: PaginationParams
  ): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get<ApiResponse<Court[]>>("/courts", {
      params,
    });
    return response.data;
  },

  getCourtById: async (id: string): Promise<ApiResponse<Court>> => {
    const response = await axiosInstance.get<ApiResponse<Court>>(
      `/courts/${id}`
    );
    return response.data;
  },

  getCourtsByType: async (type: string): Promise<ApiResponse<Court[]>> => {
    const response = await axiosInstance.get<ApiResponse<Court[]>>(
      `/courts/type/${type}`
    );
    return response.data;
  },
};
