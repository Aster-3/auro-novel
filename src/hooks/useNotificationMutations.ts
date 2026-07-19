import {
  markAllPersonalNotificationsAsRead,
  markGlobalNotificationsLastSeen,
  markPersonalNotificationAsRead,
} from "@/services/NotificationService";
import { GlobalNotificationListResponse } from "@/types/notification";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";

const invalidateNotificationQueries = (queryClient: QueryClient) => {
  queryClient.invalidateQueries({ queryKey: ["my-notification-count"] });
  queryClient.invalidateQueries({ queryKey: ["my-notifications"] });
  queryClient.invalidateQueries({ queryKey: ["my-global-notifications"] });
};

export const useMarkPersonalNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPersonalNotificationAsRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
};

export const useMarkAllPersonalNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllPersonalNotificationsAsRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
};

export const useMarkGlobalNotificationsLastSeen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markGlobalNotificationsLastSeen,
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: ["my-notification-count"] }),
        queryClient.cancelQueries({ queryKey: ["my-global-notifications"] }),
      ]);

      const previousCounts = queryClient.getQueryData<{
        personalUnreadCount: number;
        globalUnreadCount: number;
        totalUnreadCount: number;
      }>(["my-notification-count"]);
      const previousGlobalNotifications =
        queryClient.getQueryData<InfiniteData<GlobalNotificationListResponse>>([
          "my-global-notifications",
        ]);

      queryClient.setQueryData(
        ["my-notification-count"],
        (
          old:
            | {
                personalUnreadCount: number;
                globalUnreadCount: number;
                totalUnreadCount: number;
              }
            | undefined,
        ) => {
          if (!old) return old;

          return {
            ...old,
            globalUnreadCount: 0,
            totalUnreadCount: Math.max(
              0,
              old.totalUnreadCount - old.globalUnreadCount,
            ),
          };
        },
      );

      queryClient.setQueryData<InfiniteData<GlobalNotificationListResponse>>(
        ["my-global-notifications"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => ({ ...item, isNew: false })),
            })),
          };
        },
      );

      return { previousCounts, previousGlobalNotifications };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousCounts) {
        queryClient.setQueryData(
          ["my-notification-count"],
          context.previousCounts,
        );
      }

      if (context?.previousGlobalNotifications) {
        queryClient.setQueryData(
          ["my-global-notifications"],
          context.previousGlobalNotifications,
        );
      }
    },
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
};
