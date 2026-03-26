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
