import { verifyToken } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useVerifyToken = () => {
  return useMutation({
    mutationKey: ["verifyToken"],
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      verifyToken(email, code),
  });
};
