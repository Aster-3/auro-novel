import { LanguageType } from "./novel";

export interface Category {
  id: number;
  enName: string;
  trName: string;
  coverUrl: string;
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
  lang: LanguageType;
  limit?: number;
  page?: number;
}
