import { getAuthorTransactions } from "@/services/AuthorService";
import { AuthorTransactionType } from "@/types/author";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useAuthorTransactionsQuery = (dto: {
  page?: number;
  limit?: number;
  filterBy?: AuthorTransactionType;
  since?: Date;
}) => {
  return useInfiniteQuery({
    queryKey: [
      "author-transactions",
      dto.page,
      dto.limit,
      dto.filterBy,
      dto.since,
    ],
    queryFn: async ({ pageParam = 1 }) =>
      getAuthorTransactions({ ...dto, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPageResponse) =>
      lastPageResponse.nextPage || undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
  });
};
