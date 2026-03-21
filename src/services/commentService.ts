import api from "@/api/axiosInstance";
import {
  Comment,
  GetCommentsRequest,
  GetCommentsResponse,
  PreviewComment,
} from "@/types/comment";

export const getComments = async (
  query: GetCommentsRequest,
): Promise<GetCommentsResponse> => {
  const { data } = await api.get(`/novels/${query.novelId}/comments`, {
    params: query,
  });
  return data;
};

export const getCommentPreviews = async (
  novelId: string,
): Promise<{ items: PreviewComment[]; total: number }> => {
  const { data } = await api.get(`/novels/${novelId}/comments/last3`);
  return data;
};

export const createComment = async ({
  novelId,
  content,
  isRecommend,
}: {
  novelId: string;
  content: string;
  isRecommend: boolean;
}): Promise<Comment> => {
  const { data } = await api.post(`/novels/${novelId}/comments`, {
    content,
    isRecommend,
  });
  return data;
};

export const toggleLike = async (commentId: number) => {
  const { data } = await api.post(`/comments/${commentId}/toggle-like`);
  return data;
};

export const getMyComment = async (
  novelId: string,
): Promise<Comment | null> => {
  const { data } = await api.get(`/novels/${novelId}/my-comment`);
  return data;
};

export const deleteComment = async (commentId: number) => {
  await api.delete(`/comments/${commentId}`);
};

export const getOneComment = async (
  commentId: number,
): Promise<Comment | null> => {
  const { data } = await api.get(`/comments/${commentId}`);
  return data;
};
