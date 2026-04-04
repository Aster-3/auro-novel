import { createVolume } from "@/services/VolumeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateVolume = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => createVolume(novelId, name),
    onSuccess: (data) => {
      console.log("Cilt oluşturuldu:", data);
      queryClient.invalidateQueries({ queryKey: ["volumes", novelId] });
    },
    onError: (error) => {
      console.error("Cilt oluşturulurken hata oluştu:", error);
    },
  });
};
