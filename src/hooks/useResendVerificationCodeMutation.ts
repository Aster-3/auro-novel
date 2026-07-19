import { resendVerificationCode } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useResendVerificationCodeMutation = () => {
  return useMutation({
    mutationKey: ["resend-verification-code"],
    mutationFn: (email: string) => resendVerificationCode(email),
  });
};
