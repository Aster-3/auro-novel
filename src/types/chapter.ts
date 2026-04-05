import { SortType } from "./constants";
import { SeriesStatus } from "./novel";

export enum PublicationStatus {
  PUBLISHED = "published",
  UNPUBLISHED = "unpublished",
}

export interface Chapter {
  id: string;
  title: string;
  chapterOrder: number;
  volumeOrder: number;
  volumeName: string;
  volumeId: number;
  isLocked: boolean;
  publishedAt: string;
  isUnpublished?: boolean;
}

export interface ChapterDetail {
  id: string;
  title: string;
  content: string;
  chapterOrder: number;
  isLocked: boolean;
  nextChapterId: string | null;
  previousChapterId: string | null;
  novelStatus: SeriesStatus;
}

export interface GetChapters {
  items: Chapter[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}

export interface DraftChapter {
  id: string;
  title: string;
  createdAt: string;
}

export interface DraftChapterDetail {
  id: string;
  title: string;
  content: string;
  novel: {
    id: string;
    author: {
      userId: string;
    };
  };
}

export interface PublishChapterRequest {
  chapterId: string;
  novelId: string;
  volumeId?: string;
}

export interface GetDraftChapters {
  items: DraftChapter[];
  total: number;
  currentPage: number;
  lastPage: number;
  nextPage: number | null;
}

export interface GetChaptersRequest {
  id: string;
  page?: number;
  limit?: number;
  sort: SortType;
}

export interface ChapterSummary {
  total: number;
  lastPublishedAt: string;
}

export interface UpdateChapterRequest {
  id: string;
  title?: string;
  content?: string;
}

export interface CreateChapterRequest {
  novelId: string;
  title: string;
  content: string;
  volumeId?: string;
}
