import api from "@/api/axiosInstance";
import { GetTagsRequest, GetTagsResponse } from "@/types/tag";

export const getTags = async (
  dto: GetTagsRequest,
): Promise<GetTagsResponse> => {
  console.log("Fetching tags with params:", dto);
  const { data } = await api.get(`/tags`, { params: dto });
  return data;
};
