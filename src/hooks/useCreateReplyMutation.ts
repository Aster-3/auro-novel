import { createReply } from "@/services/ReplyService";
import { useToastStore } from "@/store/useToastStore";
import { CreateReplyRequest } from "@/types/reply";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateReplyMutation = (commentId: number, novelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createReply"],
    mutationFn: (dto: CreateReplyRequest) => createReply(dto),
    onError: (error) => {
      console.error("Reply creation failed:", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["replies", "list", commentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["myComment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", "list", novelId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comment", commentId],
      });
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Yanıtınız başarıyla gönderildi.",
      });
    },
  });
};
