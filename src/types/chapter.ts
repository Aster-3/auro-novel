export interface Chapter {
  id: string;
  title: string;
  order: number;
  createdAt: string;
}

export interface GetChapters {
  count: number;
  data: Chapter[];
  currentPage: number;
  lastPage: number;
}

export interface ChapterSummary {
  total: number;
  lastPublishedAt: string;
}
