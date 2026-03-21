export interface GetCommentsRequest {
  novelId: string;
  limit?: number;
  page?: number;
  sort?: "newest" | "oldest" | "mostLiked";
}

export interface Comment {
  id: number;
  content: string;
  isRecommend: boolean;
  user: {
    id: string;
    nickname: string;
    profileImageUrl?: string;
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
