import api from "@/api/axiosInstance";
import {
  GetTaggedNovelsResponse,
  GetTagsRequest,
  GetTagsResponse,
} from "@/types/tag";

export const getTags = async (
  dto: GetTagsRequest,
): Promise<GetTagsResponse> => {
  console.log("Fetching tags with params:", dto);
  const { data } = await api.get(`/tags`, { params: dto });
  return data;
};

export const getRandomTags = async (
  limit?: number,
): Promise<{ id: string; name: string }[]> => {
  const { data } = await api.get(`/tags/random`, {
    params: { count: limit || 20 },
  });
  return data;
};

export const getNovelsByTag = async ({
  id,
  page = 1,
  limit = 20,
}: {
  id: string;
  page?: number;
  limit?: number;
}): Promise<GetTaggedNovelsResponse> => {
  const { data } = await api.get(`/tags/${id}`, {
    params: { page, limit },
  });
  return data;
};
