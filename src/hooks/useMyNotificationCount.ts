import { getTotalUnreadNotificationsCount } from "@/services/NotificationService";
import { useQuery } from "@tanstack/react-query";

export const useMyNotificationCount = (enabled = true) => {
  return useQuery({
    queryKey: ["my-notification-count"],
    queryFn: async () => getTotalUnreadNotificationsCount(),
    enabled,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });
};
