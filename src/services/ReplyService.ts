import api from "@/api/axiosInstance";
import {
  CreateReplyRequest,
  GetRepliesRequest,
  GetRepliesResponse,
} from "@/types/reply";

export const getReplies = async (
  dto: GetRepliesRequest,
): Promise<GetRepliesResponse> => {
  const { data } = await api.get(
    `/comments/${dto.commentId}/replies?page=${dto.page || 1}&limit=${dto.limit || 20}`,
  );
  return data;
};

export const createReply = async (dto: CreateReplyRequest) => {
  const { data } = await api.post(`/replies`, {
    content: dto.content,
    parentReplyId: dto.parentReplyId,
    rootCommentId: dto.rootCommentId,
  });
  return data;
};

export const deleteReply = async (replyId: number) => {
  await api.patch(`/replies/${replyId}`);
};

export const likeReply = async (replyId: number) => {
  await api.post(`/replies/${replyId}/toggle-like`);
};
