import { createTagAndFind } from "@/services/TagService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createTagAndFind(name),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};
