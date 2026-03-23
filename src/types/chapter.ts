export interface Chapter {
  id: string;
  title: string;
  order: number;
  isUnlocked: boolean;
  createdAt: string;
}

export interface GetChapters {
  items: Chapter[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}

export interface ChapterSummary {
  total: number;
  lastPublishedAt: string;
}
