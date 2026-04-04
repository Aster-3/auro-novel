import { updateChapter } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { UpdateChapterRequest } from "@/types/chapter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChapterMutation = (chapterId: string, novelId: string, isDraft?: boolean) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateChapterRequest) => updateChapter(dto),
    onSuccess: (data, variables, context) => {
      if (isDraft) {
        console.log("Draft chapter updated, invalidating draft queries");
        queryClient.invalidateQueries({
          queryKey: ["draftChapterDetail", chapterId],
        });
        queryClient.invalidateQueries({
          queryKey: ["draft-chapters", novelId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["chapterDetail", chapterId],
        });
        queryClient.invalidateQueries({
          queryKey: ["chapters", novelId],
        });
      }
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
