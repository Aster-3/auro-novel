import api from "@/api/axiosInstance";
import {
  ChapterDetail,
  CreateChapterRequest,
  DraftChapterDetail,
  GetChapters,
  GetChaptersRequest,
  GetDraftChapters,
  PublishChapterRequest,
  UpdateChapterRequest,
} from "@/types/chapter";
import { OfflineChapterPayload } from "@/types/offline";

export const getChapters = async (
  query: GetChaptersRequest,
): Promise<GetChapters> => {
  const { data } = await api.get(
    `/novels/${query.id}/chapters?page=${query.page || 1}&limit=${query.limit || 20}&sort=${query.sort}`,
  );
  return data;
};

export const getDraftChapters = async (query: {
  id: string;
  page?: number;
  limit?: number;
}): Promise<GetDraftChapters> => {
  const { data } = await api.get(
    `/novels/${query.id}/draft-chapters?page=${query.page || 1}&limit=${query.limit || 20}`,
  );
  return data;
};

export const getChapterDetail = async (id: string): Promise<ChapterDetail> => {
  const { data } = await api.get(`/chapters/${id}`);
  return data;
};

export const getOfflineChapter = async (
  id: string,
): Promise<OfflineChapterPayload> => {
  const { data } = await api.get(`/chapters/${id}/offline`);
  return data;
};

export const getDraftChapterDetail = async (
  id: string,
): Promise<DraftChapterDetail> => {
  const { data } = await api.get(`/chapters/${id}/draft`);
  return data;
};

export const updateChapter = async (dto: UpdateChapterRequest) => {
  console.log("Updating chapter with DTO:", dto);
  const { data } = await api.patch(`/chapters/${dto.id}`, dto);
  return data;
};

export const createChapter = async (dto: CreateChapterRequest) => {
  const { data } = await api.post(`/chapters`, dto);
  return data;
};

export const deleteChapter = async (id: string) => {
  const { data } = await api.delete(`/chapters/${id}`);
  return data;
};

export const publishChapter = async (dto: PublishChapterRequest) => {
  const { data } = await api.post(`/chapters/${dto.chapterId}/publish`, {
    novelId: dto.novelId,
    volumeId: dto.volumeId,
  });
  return data;
};

export const changeChapterPublicationStatus = async (
  chapterId: string,
  publicationStatus: string,
) => {
  const { data } = await api.patch(
    `/chapters/${chapterId}/publication-status`,
    {
      publicationStatus,
    },
  );
  return data;
};
