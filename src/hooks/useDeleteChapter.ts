import { deleteChapter } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteChapter = (isPublished: boolean, novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["deleteChapter"],
    mutationFn: (id: string) => deleteChapter(id),
    onSuccess: () => {
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Bölüm başarıyla silindi.",
      });
      if (isPublished) {
        queryClient.invalidateQueries({ queryKey: ["chapters", novelId] });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["draft-chapters", novelId],
        });
      }
      queryClient.invalidateQueries({ queryKey: ["novelDetail", novelId] });
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
