import api from "@/api/axiosInstance";
import {
  ChapterComment,
  ChapterCommentPage,
  ChapterCommentQuery,
  ChapterCommentRepliesQuery,
  CreateChapterCommentRequest,
  CreateChapterReplyRequest,
} from "@/types/chapterComment";

export const getChapterComments = async ({
  chapterId,
  page = 1,
  limit = 20,
}: ChapterCommentQuery): Promise<ChapterCommentPage> => {
  const { data } = await api.get(`/chapters/${chapterId}/comments`, {
    params: { page, limit },
  });
  return data;
};

export const getChapterCommentReplies = async ({
  commentId,
  page = 1,
  limit = 20,
}: ChapterCommentRepliesQuery): Promise<ChapterCommentPage> => {
  const { data } = await api.get(`/chapter-comments/${commentId}/replies`, {
    params: { page, limit },
  });
  return data;
};

export const createChapterComment = async ({
  chapterId,
  content,
}: CreateChapterCommentRequest): Promise<ChapterComment> => {
  const { data } = await api.post(`/chapters/${chapterId}/comments`, {
    content,
  });
  return data;
};

export const createChapterReply = async ({
  rootCommentId,
  content,
  parentCommentId,
}: CreateChapterReplyRequest): Promise<ChapterComment> => {
  const { data } = await api.post(
    `/chapter-comments/${rootCommentId}/replies`,
    {
      content,
      ...(parentCommentId ? { parentCommentId } : {}),
    },
  );
  return data;
};

export const toggleChapterCommentLike = async (
  commentId: number,
): Promise<{ liked: boolean }> => {
  const { data } = await api.post(`/chapter-comments/${commentId}/toggle-like`);
  return data;
};

export const deleteChapterComment = async (commentId: number) => {
  await api.delete(`/chapter-comments/${commentId}`);
};
