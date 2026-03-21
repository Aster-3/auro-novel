import { verifyUser } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useVerifyUser = () => {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyUser(email, code),
  });
};
