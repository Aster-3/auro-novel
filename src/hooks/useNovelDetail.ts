import { getNovelDetail } from "@/services/NovelService";
import { Novel } from "@/types/novel";
import { useQuery } from "@tanstack/react-query";

export const useNovelDetail = (id: string) => {
  return useQuery<Novel>({
    queryKey: ["novelDetail", id],
    queryFn: () => getNovelDetail(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
