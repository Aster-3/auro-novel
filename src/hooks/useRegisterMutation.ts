import { RegisterSchemaType } from "@/schemas/auth";
import { register } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (data: RegisterSchemaType) => register(data),
  });
};
