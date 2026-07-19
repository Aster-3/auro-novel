export interface GetTagsRequest {
  name?: string;
  limit?: number;
  page?: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  language: string;
  createdAt: string;
}

export interface GetTagsResponse {
  items: Tag[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export interface TaggedNovel {
  id: string;
  name: string;
  coverImage: string | null;
  chapterCount: number;
  rankingScore: number;
  lastChapterDate: string | null;
  positiveReviewsCount: number;
  totalReviewsCount: number;
  createdAt: string;
}

export interface GetTaggedNovelsResponse {
  items: TaggedNovel[];
  total: number;
  currentPage: number;
  nextPage: number | null;
  lastPage: number;
}
