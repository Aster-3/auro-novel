export interface GetRepliesRequest {
  commentId: number;
  page?: number;
  limit?: number;
}

export interface ParentReply {
  content: string;
  isDeleted: boolean;
  user: {
    nickname: string;
    profileImageUrl: string | null;
  };
}

export interface Reply {
  id: number;
  content: string;
  user: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
  };
  createdAt: string;
  likeCount: number;
  viewerHasLiked: boolean;
  parentReply: ParentReply | null;
}

export interface GetRepliesResponse {
  items: Reply[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export interface CreateReplyRequest {
  content: string;
  rootCommentId: number;
  parentReplyId: number | null;
}
