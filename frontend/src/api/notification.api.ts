import axiosInstance from "../lib/axios";
import type { ApiResponse } from "../types/api.types";

export interface Notification {
  _id: string;
  recipientId: string;
  type: "hearing_scheduled" | "case_update" | "document_added" | "system";
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export const notificationApi = {
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    try {
      const response = await axiosInstance.get("/notifications");
      console.log("Notifications response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
      throw error;
    }
  },

  markAsRead: async (id: string): Promise<ApiResponse<Notification>> => {
    const response = await axiosInstance.patch(`/notifications/${id}/read`);
    return response.data;
  },

  deleteNotification: async (id: string): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },

  clearAll: async (): Promise<ApiResponse<null>> => {
    const response = await axiosInstance.delete("/notifications/clear-all");
    return response.data;
  },
};
