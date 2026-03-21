import { LoginSchemaType } from "@/schemas/auth";
import { login } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useLoginMutation = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginSchemaType) => login(data),
  });
};
