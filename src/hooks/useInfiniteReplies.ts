import { getReplies } from "@/services/ReplyService";
import { GetRepliesRequest } from "@/types/reply";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteReplies = (query: GetRepliesRequest) => {
  return useInfiniteQuery({
    queryKey: ["replies", "list", query.commentId],
    queryFn: ({ pageParam = 1 }) => getReplies({ ...query, page: pageParam }),
    initialPageParam: 1,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 1000 * 60 * 1,
  });
};
