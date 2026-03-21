import { getChapters } from "@/services/ChapterService";
import { GetChapters } from "@/types/chapter";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteChapters = (query: { id: string; limit?: number }) => {
  return useInfiniteQuery<
    GetChapters,
    Error,
    InfiniteData<GetChapters>,
    [string, string, number | undefined],
    number
  >({
    queryKey: ["chapters", query.id, query.limit],
    queryFn: ({ pageParam = 1 }: { pageParam: number }) =>
      getChapters({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) => {
      const { currentPage, lastPage } = lastPageResponse;
      if (currentPage < lastPage) {
        return currentPage + 1;
      }
      return undefined;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
