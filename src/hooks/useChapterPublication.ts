import { changeChapterPublicationStatus } from "@/services/ChapterService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useChapterPublication = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      publicationStatus,
      chapterId,
    }: {
      publicationStatus: string;
      chapterId: string;
    }) => changeChapterPublicationStatus(chapterId, publicationStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters", novelId],
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
          message:
            firstErrorMessage ||
            "Bölüm yayından kaldırılırken bir hata oluştu.",
        });
      } else {
        useToastStore.getState().showToast({
          type: "Hata",
          message: "Bölüm yayından kaldırılırken bir hata oluştu.",
        });
      }
    },
  });
};
