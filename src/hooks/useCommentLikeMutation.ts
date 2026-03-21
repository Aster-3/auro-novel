import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLike } from "@/services/commentService";
import { updateInfiniteCache } from "@/utils/updateInfiniteCache";

export const useCommentLikeMutation = (novelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => toggleLike(commentId),

    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["comments", "list", novelId],
      });

      const previousComments = queryClient.getQueryData([
        "comments",
        "list",
        novelId,
      ]);

      queryClient.setQueriesData(
        { queryKey: ["comments", "list", novelId] },
        (old: any) => {
          if (!old) return old;

          const newItems = updateInfiniteCache(old, commentId, (item) => ({
            ...item,
            viewerHasLiked: !item.viewerHasLiked,
            likeCount: !item.viewerHasLiked
              ? item.likeCount + 1
              : item.likeCount - 1,
          }));
          return newItems;
        },
      );

      return { previousComments };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["myComment"],
      });
    },

    onError: (err, commentId, context) => {
      queryClient.setQueriesData(
        { queryKey: ["comments", "list", novelId] },
        context?.previousComments,
      );
    },

    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["comments", "list", novelId],
    //   });
    // },
  });
};
