import { addCategoryToNovel } from "@/services/NovelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useNovelCategoryMutation = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryIds: number[]) =>
      addCategoryToNovel(novelId, categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["novelDetail", novelId],
      });
    },
  });
};
