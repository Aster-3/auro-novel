import { getLastCreatedNovels } from "@/services/NovelService";
import { useQuery } from "@tanstack/react-query";

export const useGetLastCreatedNovels = (limit: number = 15) => {
  return useQuery({
    queryKey: ["last-created-novels", limit],
    queryFn: () => getLastCreatedNovels(limit),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
