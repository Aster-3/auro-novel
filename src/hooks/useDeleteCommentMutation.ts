import { deleteComment } from "@/services/commentService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteCommentMutation = (
  commentId: number,
  novelId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteComment"],

    mutationFn: (commentId: number) => deleteComment(commentId),

    onError: (error) => {
      useToastStore.getState().showToast({
        type: "Hata",
        message: "Yorum silinirken bir sorun oluştu.",
      });
    },

    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["replies", "list", commentId],
      // });
      queryClient.invalidateQueries({
        queryKey: ["comments", "list", novelId],
      });

      queryClient.invalidateQueries({
        queryKey: ["commentPreviews", novelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myComment"],
      });
    },
  });
};
