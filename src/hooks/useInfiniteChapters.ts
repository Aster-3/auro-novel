import { getChapters } from "@/services/ChapterService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteChapters = (query: { id: string; limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ["chapters", query.id, query.limit],
    queryFn: ({ pageParam = 1 }) => getChapters({ ...query, page: pageParam }),
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
  });
};
