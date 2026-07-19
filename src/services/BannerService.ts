import api from "@/api/axiosInstance";
import { HomeBanner } from "@/types/banner";

export const getBanners = async (): Promise<HomeBanner[]> => {
  const { data } = await api.get("/banners");
  return data;
};
