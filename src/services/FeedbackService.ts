import api from "@/api/axiosInstance";

export type FeedbackType =
  | "support"
  | "feedback"
  | "suggestion"
  | "report"
  | "other";

export interface FeedbackPayload {
  type: FeedbackType;
  subject: string;
  message: string;
  email?: string;
  metadata: {
    pageUrl: string;
    userAgent: string;
    locale: string;
    appVersion: string;
  };
}

export const sendFeedback = async (payload: FeedbackPayload) => {
  const { data } = await api.post("/feedback", payload);
  return data;
};
