import api from "@/api/axiosInstance";
import { GetVolumesByNovelIdResponse } from "@/types/volume";

export const getVolumes = async (
  novelId: string,
): Promise<GetVolumesByNovelIdResponse> => {
  const { data } = await api.get(`/volumes/novel/${novelId}`);
  return data;
};

export const createVolume = async (novelId: string, name: string) => {
  const { data } = await api.post(`/volumes`, {
    novelId,
    name,
  });
  return data;
};

export const deleteVolume = async (id: string) => {
  const { data } = await api.delete(`/volumes/${id}`);
  return data;
};

export const updateVolume = async (id: string, name: string) => {
  const { data } = await api.patch(`/volumes/${id}`, {
    name,
  });
  return data;
};
