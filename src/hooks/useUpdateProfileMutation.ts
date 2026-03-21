import { UpdateProfileSchemaType } from "@/schemas/auth";
import { updateMe } from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfileMutation = () => {
  return useMutation({
    mutationFn: (data: UpdateProfileSchemaType | FormData) => updateMe(data),
  });
};
