import { createComment } from "@/services/commentService";
import { useMutation } from "@tanstack/react-query";

export const useCommentMutation = () => {
  return useMutation({
    mutationFn: ({
      novelId,
      content,
      isRecommend,
    }: {
      novelId: string;
      content: string;
      isRecommend: boolean;
    }) => createComment({ novelId, content, isRecommend }),
  });
};
