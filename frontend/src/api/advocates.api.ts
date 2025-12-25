import axiosInstance from "@/lib/axios";
import type {
  ApiResponse,
  Advocate,
  PaginationParams,
} from "@/types/api.types";

export const advocatesApi = {
  getAllAdvocates: async (
    params?: PaginationParams
  ): Promise<ApiResponse<Advocate[]>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate[]>>(
      "/advocates",
      { params }
    );
    return response.data;
  },

  getAdvocateById: async (id: string): Promise<ApiResponse<Advocate>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate>>(
      `/advocates/${id}`
    );
    return response.data;
  },

  getAdvocatesBySpecialization: async (
    specialization: string
  ): Promise<ApiResponse<Advocate[]>> => {
    const response = await axiosInstance.get<ApiResponse<Advocate[]>>(
      `/advocates/specialization/${specialization}`
    );
    return response.data;
  },
};
