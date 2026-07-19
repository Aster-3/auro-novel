import { getMyLibrary } from "@/services/UserService";
import { useAuthStore } from "@/store/useAuthStore";
import { LibrarySortOption } from "@/types/library";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

const selectLibraryData = (data: any) => ({
  items: data.pages.flatMap((page: any) => page.items),
});

export const useMyLibrary = (
  orderType: LibrarySortOption,
  searchText?: string | null,
) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const search = searchText?.trim() || undefined;

  return useInfiniteQuery({
    queryKey: ["my-library", orderType, search],
    queryFn: async ({ pageParam = 1, signal }) =>
      getMyLibrary({
        page: pageParam,
        limit: 20,
        sort: orderType,
        search,
        signal,
      }),
    initialPageParam: 1,
    enabled: !!accessToken,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    select: selectLibraryData,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 30,
  });
};
