import { UpdateProfileSchemaType } from "@/schemas/auth";
import { updateMe } from "@/services/UserService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateProfileMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileSchemaType | FormData) => updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
    },
  });
};
