import { getTotalUnreadNotificationsCount } from "@/services/NotificationService";
import { useQuery } from "@tanstack/react-query";

export const useMyNotificationCount = () => {
  return useQuery({
    queryKey: ["my-notification-count"],
    queryFn: async () => getTotalUnreadNotificationsCount(),
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2,
  });
};
