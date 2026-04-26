import { updateUserNovelReadingStats } from "@/services/UserService";
import {
  LibrarySortOption,
  UpdateUserNovelReadingStatsPayload,
} from "@/types/library";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMutateReadStats = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-reading-stats", novelId],
    mutationFn: (dto: UpdateUserNovelReadingStatsPayload) =>
      updateUserNovelReadingStats(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["novel-reading-stats", novelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-library", LibrarySortOption.LAST_READED],
      });
    },
    onError: (error) => {
      console.error(
        "Error updating reading stats for novelId:",
        novelId,
        error,
      );
    },
  });
};
