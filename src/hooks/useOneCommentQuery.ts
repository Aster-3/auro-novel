import { getOneComment } from "@/services/commentService";
import { useQuery } from "@tanstack/react-query";

export const useOneCommentQuery = (commentId: number) => {
  return useQuery({
    queryKey: ["comment", commentId],
    queryFn: () => getOneComment(commentId),
    enabled: !!commentId,
    staleTime: 1000 * 60 * 30,
  });
};
