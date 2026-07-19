import { getGlobalNotificationDetail } from "@/services/NotificationService";
import { GlobalNotification } from "@/types/notification";
import { useQuery } from "@tanstack/react-query";

export const useGlobalNotificationDetail = (
  notificationId: string,
  initialNotification?: GlobalNotification,
) => {
  return useQuery({
    queryKey: ["global-notification-detail", notificationId],
    queryFn: () => getGlobalNotificationDetail(notificationId),
    initialData: initialNotification,
  });
};
