import { getSimilarNovels } from "@/services/NovelService";
import { useQuery } from "@tanstack/react-query";

export const useSimilarNovels = (id: string, limit: number = 10) => {
  return useQuery({
    queryKey: ["similar-novels", id, limit],
    queryFn: () => getSimilarNovels(id, limit),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
