import { getMyNotifications } from "@/services/NotificationService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useMyNotifications = () => {
  return useInfiniteQuery({
    queryKey: ["my-notifications"],
    queryFn: async ({ pageParam = 1 }) =>
      await getMyNotifications({
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
