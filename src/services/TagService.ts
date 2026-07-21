import api from "@/api/axiosInstance";
import {
  GetTaggedNovelsResponse,
  GetTagsRequest,
  GetTagsResponse,
  Tag,
} from "@/types/tag";

export interface CreateTagPayload {
  name: string;
}

export interface CreateTagResponse {
  message: string;
}

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

export const createTag = async (
  payload: CreateTagPayload,
): Promise<CreateTagResponse> => {
  const { data } = await api.post("/tags", payload);
  return data;
};

export const createTagAndFind = async (name: string): Promise<Tag> => {
  await createTag({ name });
  const tags = await getTags({ name, limit: 10 });
  const normalizedName = name.trim().toLocaleLowerCase("tr-TR");
  const createdTag = tags.items.find(
    (tag) => tag.name.trim().toLocaleLowerCase("tr-TR") === normalizedName,
  );

  if (!createdTag) {
    throw new Error("Oluşturulan etiket listede bulunamadı.");
  }

  return createdTag;
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
