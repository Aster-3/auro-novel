import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDownloadedChapters,
  getDownloadedChaptersByNovel,
  getDownloadedNovelSummaries,
  getDownloadedNovelSummary,
} from "@/db/offlineChaptersDb";
import { useToastStore } from "@/store/useToastStore";
import { isPremiumActive, useAuthStore } from "@/store/useAuthStore";

export const useDownloadedNovelsQuery = () => {
  const userId = useAuthStore((state) => state.user?.id);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canUseOffline = !!userId && isPremiumActive(isPremium, premiumUntil);

  return useQuery({
    queryKey: ["downloadedNovels", userId],
    queryFn: () => getDownloadedNovelSummaries(userId!),
    enabled: canUseOffline,
  });
};

export const useDownloadedNovelDetailQuery = (novelId: string) => {
  const userId = useAuthStore((state) => state.user?.id);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canUseOffline = !!userId && isPremiumActive(isPremium, premiumUntil);

  return useQuery({
    queryKey: ["downloadedNovelDetail", userId, novelId],
    queryFn: () => getDownloadedNovelSummary(userId!, novelId),
    enabled: canUseOffline && !!novelId,
  });
};

export const useDownloadedNovelChaptersQuery = (novelId: string) => {
  const userId = useAuthStore((state) => state.user?.id);
  const isPremium = useAuthStore((state) => state.isPremium);
  const premiumUntil = useAuthStore((state) => state.premiumUntil);
  const canUseOffline = !!userId && isPremiumActive(isPremium, premiumUntil);

  return useQuery({
    queryKey: ["downloadedNovelChapters", userId, novelId],
    queryFn: () => getDownloadedChaptersByNovel(userId!, novelId),
    enabled: canUseOffline && !!novelId,
  });
};

export const useDeleteDownloadedChaptersMutation = (novelId: string) => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (chapterIds: string[]) =>
      deleteDownloadedChapters(userId!, novelId, chapterIds),
    onSuccess: async (_, chapterIds) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["downloadedNovels", userId] }),
        queryClient.invalidateQueries({
          queryKey: ["downloadedNovelDetail", userId, novelId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["downloadedNovelChapters", userId, novelId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["downloadedChapterIds", userId, novelId],
        }),
      ]);

      useToastStore.getState().showToast({
        type: "Başarılı",
        message:
          chapterIds.length > 1
            ? `${chapterIds.length} bölüm silindi.`
            : "Bölüm silindi.",
      });
    },
    onError: () => {
      useToastStore.getState().showToast({
        type: "Hata",
        message: "Bölüm silinirken bir hata oluştu.",
      });
    },
  });
};
