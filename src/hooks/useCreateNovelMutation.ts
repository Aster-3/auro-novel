import { createNovel } from "@/services/NovelService";
import { useMutation } from "@tanstack/react-query";

export const useCreateNovelMutation = () => {
  return useMutation({
    mutationFn: (dto: FormData) => createNovel(dto),
  });
};
