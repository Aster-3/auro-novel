import { getComments } from "@/services/commentService";
import { GetCommentsRequest } from "@/types/comment";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteComments = (query: GetCommentsRequest) => {
  return useInfiniteQuery({
    queryKey: ["comments", "list", query.novelId, query.sort],
    queryFn: ({ pageParam }) => getComments({ ...query, page: pageParam }),
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 1,
  });
};
