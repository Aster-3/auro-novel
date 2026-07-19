import { ResetPasswordSchemaType } from "@/schemas/auth";
import { resetPassword } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

type ResetPasswordPayload = ResetPasswordSchemaType & {
  email: string;
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
  });
};
