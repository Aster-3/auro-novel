import { deleteReply } from "@/services/ReplyService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteReplyMutation = (commentId: number, novelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteReply"],

    mutationFn: (replyId: number) => deleteReply(replyId),

    onError: (error) => {
      useToastStore.getState().showToast({
        type: "Hata",
        message: "Yanıt silinirken bir sorun oluştu.",
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", "list", commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", "list", novelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comment", commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myComment"],
      });
    },
  });
};
