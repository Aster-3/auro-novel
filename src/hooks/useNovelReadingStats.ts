import { getUserNovelReadingStats } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";

export const useNovelReadingStats = (novelId: string) => {
  return useQuery({
    queryKey: ["novel-reading-stats", novelId],
    queryFn: async () => getUserNovelReadingStats(novelId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};
