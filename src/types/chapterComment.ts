export interface ChapterCommentUser {
  id: string;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ChapterCommentParent {
  id: number;
  content: string | null;
  isDeleted: boolean;
  user: ChapterCommentUser;
}

export interface ChapterComment {
  id: number;
  content: string | null;
  isDeleted: boolean;
  chapterId: string;
  novelId: string;
  rootCommentId: number | null;
  parentCommentId: number | null;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  updatedAt: string;
  user: ChapterCommentUser;
  parentComment: ChapterCommentParent | null;
  viewerHasLiked: boolean;
}

export interface ChapterCommentPage {
  items: ChapterComment[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
}

export interface ChapterCommentQuery {
  chapterId: string;
  page?: number;
  limit?: number;
}

export interface ChapterCommentRepliesQuery {
  commentId: number;
  page?: number;
  limit?: number;
}

export interface CreateChapterCommentRequest {
  chapterId: string;
  content: string;
}

export interface CreateChapterReplyRequest {
  rootCommentId: number;
  content: string;
  parentCommentId?: number;
}
