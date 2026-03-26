import { getTags } from "@/services/TagService";
import { GetTagsRequest } from "@/types/tag";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteTags = (
  query: GetTagsRequest,
  enabled: boolean = true,
) => {
  return useInfiniteQuery({
    queryKey: ["tags", query.name],
    queryFn: async ({ pageParam = 1 }) =>
      getTags({ ...query, page: pageParam }),
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    enabled: enabled,
  });
};
