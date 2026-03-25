import { updateNovel } from "@/services/NovelService";
import { UpdateNovelFormData } from "@/types/novel";
import { useMutation } from "@tanstack/react-query";

export const useNovelMutation = () => {
  return useMutation({
    mutationFn: ({
      novelId,
      dto,
    }: {
      novelId: string;
      dto: UpdateNovelFormData;
    }) => updateNovel(novelId, dto),
    onSuccess: () => {
      // Başarılı güncelleme sonrası yapılacak işlemler (örneğin, önbelleği temizleme veya bildirim gösterme)
      console.log("Novel updated successfully");
    },

    onError: (error) => {
      console.error("Error updating novel:", error);
    },
  });
};
