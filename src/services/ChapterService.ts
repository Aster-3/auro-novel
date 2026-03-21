import api from "@/api/axiosInstance";

export const getChapters = async (query: {
  id: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await api.get(
    `/novels/${query.id}/chapters?page=${query.page || 1}&limit=${query.limit || 20}`,
  );
  return data;
};

export const getChapterSummary = async (id: string) => {
  const { data } = await api.get(`/novels/${id}/chapters/summary`);
  return data;
};
