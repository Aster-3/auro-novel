import { getCommentPreviews } from "@/services/commentService";
import { PreviewComment } from "@/types/comment";
import { useQuery } from "@tanstack/react-query";

export const useCommentPreviews = (novelId: string) => {
  return useQuery({
    queryKey: ["commentPreviews", novelId],
    queryFn: () => getCommentPreviews(novelId),
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: true,
  });
};
