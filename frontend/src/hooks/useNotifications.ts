import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import toast from "react-hot-toast";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const notificationsQuery = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.getNotifications(),
    refetchInterval: 30000, // Poll every 30 seconds
    retry: 2,
  });

  // Log errors if they occur
  if (notificationsQuery.error) {
    console.error("Failed to fetch notifications:", notificationsQuery.error);
  }

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => notificationApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => notificationApi.clearAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications cleared");
    },
  });

  return {
    notifications: notificationsQuery.data?.data || [],
    isLoading: notificationsQuery.isLoading,
    unreadCount: (notificationsQuery.data?.data || []).filter((n) => !n.isRead).length,
    markAsRead: markAsReadMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    clearAll: clearAllMutation.mutate,
  };
};
