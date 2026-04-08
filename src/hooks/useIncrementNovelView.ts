import { incrementNovelViewCount } from "@/services/NovelService";
import { useMutation } from "@tanstack/react-query";

export const useIncrementNovelView = (novelId: string) => {
  return useMutation({
    mutationFn: async () => incrementNovelViewCount(novelId),
  });
};
