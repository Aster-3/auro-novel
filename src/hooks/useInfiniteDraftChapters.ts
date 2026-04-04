import { getDraftChapters } from "@/services/ChapterService";
import { ApiError } from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteDraftChapters = (
  query: {
    id: string;
    limit?: number;
  },
  isPublished?: boolean,
) => {
  return useInfiniteQuery({
    queryKey: ["draft-chapters", query.id],
    queryFn: ({ pageParam = 1 }) =>
      getDraftChapters({ ...query, page: pageParam }),
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount: any, error: ApiError) => {
      if (error.statusCode === 404 || error.statusCode === 409) {
        return false;
      }
      return failureCount < 3;
    },
    enabled: isPublished === true,
  });
};
