import { includes } from "lodash";

export interface LibraryItem {
  novelId: string;
  title: string;
  authorName: string;
  coverImageUrl: string;
  addedAt: string;
  lastReadAt: string | null;
  totalReadTime: number | null;
}

export interface LibraryResponse {
  items: LibraryItem[];
  total: number;
  nextPage: number | null;
  currentPage: number;
  lastPage: number;
}

export interface UserNovelReadingStats {
  id: string;
  novelId: string;
  lastReadChapterId: string;
  lastChapterProgress: number;
  totalReadTime: number;
  lastReadAt: string;
}

export interface UpdateUserNovelReadingStatsPayload {
  novelId: string;
  lastReadChapterId: string;
  lastChapterProgress: number;
  incrementTime: number;
}

export enum LibrarySortOption {
  LAST_READED = "lastRead",
  LAST_ADDED = "lastAdded",
  TITLE_ASC = "titleAsc",
}
