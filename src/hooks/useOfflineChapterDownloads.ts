import { useCallback, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOfflineChapters,
  getOfflineManifest,
} from "@/services/NovelService";
import { getOfflineChapter } from "@/services/ChapterService";
import {
  addOfflineDownloadRetry,
  getDownloadedChapterIdsByNovel,
  upsertDownloadedChapters,
  upsertDownloadedNovel,
} from "@/db/offlineChaptersDb";
import { OfflineNovelManifest } from "@/types/offline";
import { useToastStore } from "@/store/useToastStore";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";

const BATCH_SIZE = 100;

const chunk = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const getErrorMessage = (error: unknown) => {
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message?: unknown }).message);
  }
  return "İndirme sırasında bir hata oluştu.";
};

export interface OfflineChapterDownloadControls {
  canUseOfflineDownloads: boolean;
  isManifestLoading: boolean;
  downloadedIds: Set<string>;
  downloadedCount: number;
  totalChapterCount: number;
  missingChapterIds: string[];
  downloadingChapterIds: string[];
  isDownloadingAll: boolean;
  downloadProgress: {
    completed: number;
    total: number;
  };
  downloadChapter: (chapterId: string) => Promise<void>;
  downloadAll: () => Promise<void>;
}

export const useOfflineChapterDownloads = (novelId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const ownerUserId = user?.id ?? null;
  const canUseOfflineDownloads = !!ownerUserId && isPremiumActive(isPremium, premiumUntil);
  const [downloadingChapterIds, setDownloadingChapterIds] = useState<string[]>(
    [],
  );
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState({
    completed: 0,
    total: 0,
  });

  const manifestQuery = useQuery({
    queryKey: ["offlineManifest", novelId],
    queryFn: () => getOfflineManifest(novelId),
    enabled: !!novelId && canUseOfflineDownloads,
    staleTime: 1000 * 60 * 5,
  });

  const downloadedIdsQuery = useQuery({
    queryKey: ["downloadedChapterIds", ownerUserId, novelId],
    queryFn: () => getDownloadedChapterIdsByNovel(ownerUserId!, novelId),
    enabled: !!novelId && canUseOfflineDownloads,
    staleTime: 1000 * 15,
  });

  const downloadedIds = useMemo(
    () => new Set(downloadedIdsQuery.data ?? []),
    [downloadedIdsQuery.data],
  );

  const manifest = manifestQuery.data;
  const totalChapterCount =
    manifest?.totalPublishedChapters ?? manifest?.chapters.length ?? 0;
  const downloadedCount = downloadedIds.size;
  const missingChapterIds = useMemo(() => {
    if (!manifest) return [];
    return manifest.chapters
      .filter((chapter) => !downloadedIds.has(chapter.id))
      .map((chapter) => chapter.id);
  }, [downloadedIds, manifest]);

  const invalidateDownloadedIds = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: ["downloadedChapterIds", ownerUserId, novelId],
    });
    await queryClient.invalidateQueries({
      queryKey: ["downloadedNovels"],
    });
  }, [novelId, ownerUserId, queryClient]);

  const ensureManifest = useCallback(async (): Promise<OfflineNovelManifest> => {
    return queryClient.fetchQuery({
      queryKey: ["offlineManifest", novelId],
      queryFn: () => getOfflineManifest(novelId),
      staleTime: 1000 * 60 * 5,
    });
  }, [novelId, queryClient]);

  const downloadChapter = useCallback(
    async (chapterId: string) => {
      if (!chapterId || downloadingChapterIds.includes(chapterId)) return;
      if (downloadedIds.has(chapterId)) return;
      if (!ownerUserId || !canUseOfflineDownloads) return;

      setDownloadingChapterIds((current) => [...current, chapterId]);

      try {
        const currentManifest = await ensureManifest();
        const chapter = await getOfflineChapter(chapterId);

        await upsertDownloadedNovel(
          ownerUserId,
          currentManifest.novel,
          currentManifest.generatedAt,
        );
        await upsertDownloadedChapters(ownerUserId, [chapter]);
        await invalidateDownloadedIds();
      } catch (error) {
        const message = getErrorMessage(error);
        await addOfflineDownloadRetry(ownerUserId, novelId, chapterId, message);
      } finally {
        setDownloadingChapterIds((current) =>
          current.filter((id) => id !== chapterId),
        );
      }
    },
    [
      downloadedIds,
      downloadingChapterIds,
      canUseOfflineDownloads,
      ensureManifest,
      invalidateDownloadedIds,
      novelId,
      ownerUserId,
    ],
  );

  const downloadAll = useCallback(async () => {
    if (isDownloadingAll) return;
    if (!ownerUserId || !canUseOfflineDownloads) {
      useToastStore.getState().showToast({
        type: "Uyarı",
        message: "Offline indirme için aktif Auro Pass hesabı gerekir.",
      });
      return;
    }

    setIsDownloadingAll(true);

    try {
      const currentManifest = await ensureManifest();
      const localIds = new Set(
        await getDownloadedChapterIdsByNovel(ownerUserId, novelId),
      );
      const missingIds = currentManifest.chapters
        .filter((chapter) => !localIds.has(chapter.id))
        .map((chapter) => chapter.id);

      if (!missingIds.length) {
        useToastStore.getState().showToast({
          type: "Bilgi",
          message: "Tüm bölümler zaten indirilmiş.",
        });
        return;
      }

      const initiallyCompleted =
        currentManifest.totalPublishedChapters - missingIds.length;

      setDownloadProgress({
        completed: initiallyCompleted,
        total: currentManifest.totalPublishedChapters,
      });

      await upsertDownloadedNovel(
        ownerUserId,
        currentManifest.novel,
        currentManifest.generatedAt,
      );

      let completed = initiallyCompleted;

      for (const batch of chunk(missingIds, BATCH_SIZE)) {
        setDownloadingChapterIds((current) =>
          Array.from(new Set([...current, ...batch])),
        );

        try {
          const response = await getOfflineChapters(novelId, batch);
          await upsertDownloadedNovel(
            ownerUserId,
            response.novel,
            response.generatedAt,
          );
          await upsertDownloadedChapters(ownerUserId, response.chapters);

          completed += response.chapters.length;
          setDownloadProgress({
            completed,
            total: currentManifest.totalPublishedChapters,
          });

          for (const skippedId of response.skippedChapterIds) {
            await addOfflineDownloadRetry(
              ownerUserId,
              novelId,
              skippedId,
              "Bölüm indirilebilir değil veya bu romana ait değil.",
            );
          }
        } catch (error) {
          const message = getErrorMessage(error);
          await Promise.all(
            batch.map((chapterId) =>
              addOfflineDownloadRetry(ownerUserId, novelId, chapterId, message),
            ),
          );
          useToastStore.getState().showToast({
            type: "Hata",
            message,
          });
        } finally {
          setDownloadingChapterIds((current) =>
            current.filter((id) => !batch.includes(id)),
          );
        }
      }

      await invalidateDownloadedIds();
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "İndirme tamamlandı.",
      });
    } finally {
      setIsDownloadingAll(false);
    }
  }, [
    canUseOfflineDownloads,
    ensureManifest,
    invalidateDownloadedIds,
    isDownloadingAll,
    novelId,
    ownerUserId,
  ]);

  return {
    canUseOfflineDownloads,
    manifest,
    isManifestLoading: manifestQuery.isLoading,
    downloadedIds,
    downloadedCount,
    totalChapterCount,
    missingChapterIds,
    downloadingChapterIds,
    isDownloadingAll,
    downloadProgress,
    downloadChapter,
    downloadAll,
  };
};
