import { UpdateProfileSchemaType } from "@/schemas/auth";
import { updateMe } from "@/services/UserService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateMeMutation = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["updateMe"],
    mutationFn: (data: UpdateProfileSchemaType) => updateMe(data),
    onSuccess: () => {},
  });
};
