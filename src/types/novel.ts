export enum SeriesStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus",
  CANCELLED = "cancelled",
  DRAFT = "draft",
}

export enum LanguageType {
  EN = "en",
  TR = "tr",
}

export enum NovelFormat {
  NOVEL = "novel",
  SHORT_STORY = "short_story",
}

export enum sourceType {
  LOCAL = "local",
  GLOBAL = "global",
}

export interface SearchNovel {
  id: string;
  name: string;
  coverImage: string;
}

export interface SearchNovelResult {
  items: SearchNovel[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export enum SourceType {
  LOCAL = "local",
  GLOBAL = "global",
}

export interface Category {
  id: number;
  enName: string;
  trName: string;
  coverUrl: string | null;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Author {
  id: string;
  nickname: string | null;
  user: {
    id: string;
    nickname: string;
  } | null;
}

export interface Novel {
  id: string;
  name: string;
  coverImage: string;
  synopsis: string;
  status: SeriesStatus;
  author: Author;
  viewCount: number;
  positiveReviewsCount: number;
  totalReviewsCount: number;
  recommendationRate: number | null;
  popularityScore: number;
  categories: Category[];
  tags: Tag[];
}

export interface CreateNovelFormData {
  name: string;
  coverImage: {
    uri: string;
    name: string;
    type: string;
  } | null;
  slug: string;
}

export interface UpdateNovelFormData {
  name?: string;
  coverImage?: {
    uri: string;
    name: string;
    type: string;
  } | null;
  slug?: string;
  tags?: string[]; // Sadece tag ID'leri gönderilecek
  categories?: number[]; // Sadece kategori ID'leri gönderilecek
}
