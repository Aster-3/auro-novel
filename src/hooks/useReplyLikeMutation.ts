import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeReply } from "@/services/ReplyService";
import { updateInfiniteCache } from "@/utils/updateInfiniteCache";

export const useReplyLikeMutation = (commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (replyId: number) => likeReply(replyId),

    onMutate: async (replyId: number) => {
      await queryClient.cancelQueries({
        queryKey: ["replies", "list", commentId],
      });

      const previousReplies = queryClient.getQueryData([
        "replies",
        "list",
        commentId,
      ]);

      queryClient.setQueriesData(
        { queryKey: ["replies", "list", commentId] },
        (old: any) => {
          if (!old) return old;

          const newItems = updateInfiniteCache(old, replyId, (item) => ({
            ...item,
            viewerHasLiked: !item.viewerHasLiked,
            likeCount: !item.viewerHasLiked
              ? item.likeCount + 1
              : item.likeCount - 1,
          }));
          return newItems;
        },
      );

      return { previousReplies };
    },

    onError: (err, replyId, context) => {
      console.error("Reply like failed:", err);
      queryClient.setQueriesData(
        { queryKey: ["replies", "list", commentId] },
        context?.previousReplies,
      );
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["replies", "list", commentId],
    //   });
    // },
  });
};
