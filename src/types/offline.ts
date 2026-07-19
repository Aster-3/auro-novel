import { SeriesStatus } from "./novel";

export interface OfflineNovelManifestNovel {
  id: string;
  name: string;
  slug: string;
  coverImage: string | null;
  synopsis: string | null;
  status: SeriesStatus | string;
  chapterCount: number;
  lastChapterDate: string | null;
  updatedAt: string;
}

export interface OfflineManifestChapter {
  id: string;
  title: string;
  chapterOrder: number;
  volumeId: string | null;
  volumeName: string | null;
  volumeOrder: number;
  publishedAt: string;
  updatedAt: string;
  wordCount: number;
}

export interface OfflineNovelManifest {
  novel: OfflineNovelManifestNovel;
  generatedAt: string;
  totalPublishedChapters: number;
  chapters: OfflineManifestChapter[];
}

export interface OfflineChapterPayload extends OfflineManifestChapter {
  novelId: string;
  content: string;
}

export interface OfflineChaptersResponse {
  novel: OfflineNovelManifestNovel;
  requestedChapterCount: number;
  returnedChapterCount: number;
  skippedChapterIds: string[];
  generatedAt: string;
  chapters: OfflineChapterPayload[];
}

export interface DownloadedNovelRow extends OfflineNovelManifestNovel {
  generatedAt: string | null;
  downloadedAt: string;
}

export interface DownloadedChapterRow extends OfflineChapterPayload {
  downloadedAt: string;
}

export interface DownloadedNovelSummary {
  novelId: string;
  name: string;
  slug: string | null;
  synopsis: string | null;
  coverImage: string | null;
  status: string | null;
  downloadedChapterCount: number;
  totalPublishedChapters: number;
  lastDownloadedAt: string;
  updatedAt: string | null;
}
