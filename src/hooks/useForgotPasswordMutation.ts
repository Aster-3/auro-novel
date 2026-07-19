import { ForgotPasswordSchemaType } from "@/schemas/auth";
import { forgotPassword } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (data: ForgotPasswordSchemaType) => forgotPassword(data),
  });
};
