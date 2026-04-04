import { createChapter } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { ApiError } from "@/types/api";
import { CreateChapterRequest } from "@/types/chapter";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateChapter = (novelId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateChapterRequest) => createChapter(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["draft-chapters", novelId] });
      queryClient.invalidateQueries({ queryKey: ["novelDetail", novelId] });
    },
    onError: (error: ApiError) => {
      if (
        error.statusCode === 422 ||
        (error.statusCode === 409 && error.errors)
      ) {
        const firstErrorMessage = Object.values(
          error.errors || {},
        ).flat()[0] as string;
        useToastStore.getState().showToast({
          type: "Hata",
          message: firstErrorMessage || "Doğrulama hatası oluştu.",
        });
      } else {
        useToastStore.getState().showToast({
          type: "Hata",
          message: "Bölüm oluşturulurken bir hata oluştu.",
        });
      }
    },
  });
};
