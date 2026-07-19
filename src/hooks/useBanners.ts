import { getBanners } from "@/services/BannerService";
import { useQuery } from "@tanstack/react-query";

export const useBanners = () => {
  return useQuery({
    queryKey: ["home-banners"],
    queryFn: getBanners,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });
};
