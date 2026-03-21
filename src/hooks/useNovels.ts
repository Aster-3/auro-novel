import { useQuery } from "@tanstack/react-query";
import { getNovels } from "@/services/NovelService";
import { SearchNovelResult } from "@/types/novel";

export const useNovels = () => {
  return useQuery<SearchNovelResult>({
    queryKey: ["novels"],
    queryFn: () => getNovels(),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
