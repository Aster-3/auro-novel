import { purchaseChapter } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { CoinType } from "@/types/wallet";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePurchaseChapter = (chapterId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (coinType: CoinType) => purchaseChapter(chapterId, coinType),
    onError: (error: any) => {
      console.error("Bölüm satın alma hatası:", error);
      useToastStore.getState().showToast({
        type: "Hata",
        message: error?.message || "Bölüm satın alınırken bir hata oluştu.",
      });
    },
    onSuccess: () => {
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Bölüm başarıyla satın alındı!",
      });
      queryClient.invalidateQueries({ queryKey: ["chapterDetail", chapterId] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};
