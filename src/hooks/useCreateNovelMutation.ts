import { createNovel } from "@/services/NovelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MY_AUTHOR_NOVELS_QUERY_KEY } from "./useAuthorMeQuery";

export const useCreateNovelMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: FormData) => createNovel(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: MY_AUTHOR_NOVELS_QUERY_KEY,
      });
      await queryClient.invalidateQueries({
        queryKey: ["user-profile", "author-novels"],
      });
    },
  });
};
