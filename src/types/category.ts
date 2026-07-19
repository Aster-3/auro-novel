export interface Category {
  id: number;
  title: string;
}

export interface GetCategoriesResponse {
  items: Category[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export interface GetCategoriesRequest {
  search?: string;
  limit?: number;
  page?: number;
}
