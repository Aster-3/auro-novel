import { getCategories } from "@/services/CategoryService";
import { GetCategoriesRequest } from "@/types/category";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteCategories = (query: GetCategoriesRequest) => {
  return useInfiniteQuery({
    queryKey: ["categories", query.search],
    queryFn: async ({ pageParam = 1 }) =>
      getCategories({ ...query, page: pageParam }),
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};
