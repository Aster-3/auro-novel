import { UpdateProfileSchemaType } from "@/schemas/auth";
import { updateMe } from "@/services/UserService";
import { useMutation } from "@tanstack/react-query";

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationKey: ["updateMe"],
    mutationFn: (data: UpdateProfileSchemaType) => updateMe(data),
  });
};
