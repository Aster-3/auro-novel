import { publishChapter } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { PublishChapterRequest } from "@/types/chapter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePublishChapter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: PublishChapterRequest) => publishChapter(dto),
    onSuccess: async (data, variables, context) => {
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Bölüm başarıyla yayınlandı.",
      });
      await queryClient.invalidateQueries({
        queryKey: ["chapterDetail", variables.chapterId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["chapters", variables.novelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["draft-chapters", variables.novelId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["novelDetail", variables.novelId],
      });
    },
    onError: (error: any) => {
      if (
        error.statusCode === 422 ||
        (error.statusCode === 409 && error.errors)
      ) {
        const firstErrorMessage = Object.values(
          error.errors,
        ).flat()[0] as string;

        useToastStore.getState().showToast({
          type: "Hata",
          message: firstErrorMessage || "Doğrulama hatası oluştu.",
        });
      } else {
        useToastStore.getState().showToast({
          type: "Hata",
          message: "Bölüm güncellenirken bir hata oluştu.",
        });
      }
    },
  });
};
