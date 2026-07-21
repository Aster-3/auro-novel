import {
  deleteMyAccount,
  DeleteMyAccountPayload,
} from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

export const useDeleteMyAccountMutation = () => {
  return useMutation({
    mutationFn: (payload: DeleteMyAccountPayload) => deleteMyAccount(payload),
  });
};
