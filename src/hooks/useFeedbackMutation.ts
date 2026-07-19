import { sendFeedback, FeedbackPayload } from "@/services/FeedbackService";
import { useMutation } from "@tanstack/react-query";

export const useFeedbackMutation = () => {
  return useMutation({
    mutationKey: ["feedback"],
    mutationFn: (payload: FeedbackPayload) => sendFeedback(payload),
  });
};
