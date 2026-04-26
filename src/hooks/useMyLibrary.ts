import { getMyLibrary } from "@/services/UserService";
import { LibrarySortOption } from "@/types/library";
import { useInfiniteQuery } from "@tanstack/react-query";

const selectLibraryData = (data: any) => ({
  items: data.pages.flatMap((page: any) => page.items),
});

export const useMyLibrary = (orderType: LibrarySortOption) => {
  return useInfiniteQuery({
    queryKey: ["my-library", orderType],
    queryFn: async ({ pageParam = 1 }) =>
      getMyLibrary({
        page: pageParam,
        limit: 20,
        sort: orderType,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    select: selectLibraryData,
  });
};
