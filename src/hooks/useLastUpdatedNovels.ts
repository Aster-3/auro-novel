import { useQuery } from "@tanstack/react-query";
import { getLastUpdatedNovels } from "@/services/NovelService";
import { GetLastUpdatedNovel } from "@/types/novel";

export const useLastUpdatedNovels = (limit: number) => {
  return useQuery<GetLastUpdatedNovel[]>({
    queryKey: ["last-updated-novels"],
    queryFn: () => getLastUpdatedNovels(limit),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
