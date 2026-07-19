export interface GetCommentsRequest {
  novelId: string;
  limit?: number;
  page?: number;
  sort?: CommentSortType;
}

export type CommentSortType = "newest" | "oldest" | "popular";

export interface Comment {
  id: number;
  content: string;
  isRecommend: boolean;
  user: {
    id: string;
    nickname: string;
    profileImageUrl: string | null;
    reviewCount: number;
  };
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  replyCount: number;
  viewerHasLiked: boolean;
}

export interface GetCommentsResponse {
  items: Comment[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export interface PreviewComment {
  id: string;
  content: string;
  isRecommend: boolean;
  user: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
  };
  createdAt: string;
}
