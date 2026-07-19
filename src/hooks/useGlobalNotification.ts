import {
  getGlobalNotifications,
} from "@/services/NotificationService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useGlobalNotification = () => {
  return useInfiniteQuery({
    queryKey: ["my-global-notifications"],
    queryFn: async ({ pageParam = 1 }) =>
      await getGlobalNotifications({
        page: pageParam,
        limit: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
    }),
  });
};
