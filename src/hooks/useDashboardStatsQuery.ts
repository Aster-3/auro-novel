import { getDashboardStats } from "@/services/StatService";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStatsQuery = (novelId: string | null) => {
  return useQuery({
    queryKey: ["dashboardStats", novelId],
    queryFn: async () => {
      const minLoadingTime = 800;
      const startTime = Date.now();
      try {
        const data = await getDashboardStats(novelId as string);

        const duration = Date.now() - startTime;
        if (duration < minLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadingTime - duration),
          );
        }

        return data;
      } catch (error) {
        const duration = Date.now() - startTime;
        if (duration < minLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadingTime - duration),
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: !!novelId,
  });
};
