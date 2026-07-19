import { searchNovels } from "@/services/NovelService";
import { SearchNovelResult } from "@/types/novel";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useSearchNovels = (name: string) => {
  const query = name.trim();

  return useQuery<SearchNovelResult>({
    queryKey: ["search-novels", query],
    queryFn: () => searchNovels(query),
    enabled: query.length > 0,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 3,
    retry: false,
  });
};
