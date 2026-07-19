import api from "@/api/axiosInstance";
import { AuthorNovelListResponse } from "@/types/novel";

export interface AuthorMe {
  isAuthor: boolean;
  authorId: string | null;
  nickname: string | null;
  isVerified: boolean;
}

export const getAuthorMe = async (): Promise<AuthorMe> => {
  const { data } = await api.get("/authors/me");
  return data;
};

export const createAuthor = async (dto?: { nickname?: string }) => {
  const body = dto?.nickname ? { nickname: dto.nickname } : {};
  const { data } = await api.post("/authors", body);
  return data;
};

export const getMyAuthorNovels = async ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<AuthorNovelListResponse> => {
  const { data } = await api.get("/authors/me/novels", {
    params: { page, limit },
  });
  return data.data ?? data;
};
