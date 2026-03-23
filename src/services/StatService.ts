import api from "@/api/axiosInstance";
import { GetDashboardStats } from "@/types/dashboard";

export const getDashboardStats = async (
  novelId: string,
): Promise<GetDashboardStats> => {
  const { data } = await api.get(`/authors/novels/${novelId}/stats`);
  return data;
};
