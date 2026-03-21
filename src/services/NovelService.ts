import api from "@/api/axiosInstance";

export const getNovels = async () => {
  const { data } = await api.get("/novels");
  return data;
};

export const getNovelDetail = async (id: string) => {
  const { data } = await api.get(`/novels/${id}`);
  return data;
};
