import { updateNovel } from "@/services/NovelService";
import { UpdateNovelFormData } from "@/types/novel";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNovelMutation = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateNovelFormData) => updateNovel(novelId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["novelDetail", novelId] });
      queryClient.invalidateQueries({ queryKey: ["novels"] });
    },
  });
};
