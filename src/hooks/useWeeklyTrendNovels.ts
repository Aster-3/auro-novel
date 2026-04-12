import { getWeeklyTrendingNovels } from "@/services/NovelService";
import { useQuery } from "@tanstack/react-query";

export const useWeeklyTrendNovels = (limit: number = 10) => {
  return useQuery({
    queryKey: ["weekly-trend-novels"],
    queryFn: () => getWeeklyTrendingNovels(limit),
    staleTime: 1000 * 60 * 60 * 24, // 24 saat boyunca taze kalır
    retry: false,
  });
};
