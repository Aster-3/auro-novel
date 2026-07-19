import { getNovelsByTag } from "@/services/TagService";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useTagNovels = (tagId: string, limit = 20) => {
  return useInfiniteQuery({
    queryKey: ["tag-novels", tagId, limit],
    queryFn: ({ pageParam = 1 }) =>
      getNovelsByTag({ id: tagId, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    enabled: !!tagId,
  });
};
