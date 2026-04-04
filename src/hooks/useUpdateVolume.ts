import { updateVolume } from "@/services/VolumeService";
import { useToastStore } from "@/store/useToastStore";
import { ApiError } from "@/types/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateVolume = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      volumeId,
      name,
    }: {
      volumeId: string;
      name: string;
    }) => updateVolume(volumeId, name),
    onSuccess: (data) => {
      console.log("Cilt güncellendi:", data);
      queryClient.invalidateQueries({ queryKey: ["volumes", novelId] });
      queryClient.invalidateQueries({ queryKey: ["chapters", novelId] });
    },
    onError: (error: any) => {
      console.log("Cilt güncellenirken hata oluştu:", error);
      if (
        error.statusCode === 422 ||
        (error.statusCode === 409 && error.errors)
      ) {
        const firstErrorMessage = Object.values(
          error.errors,
        ).flat()[0] as string;
        useToastStore.getState().showToast({
          type: "Hata",
          message:
            firstErrorMessage || "Cilt güncellenirken doğrulama hatası oluştu.",
        });
        return;
      } else {
        useToastStore.getState().showToast({
          type: "Hata",
          message: "Cilt güncellenirken bir hata oluştu.",
        });
      }
    },
  });
};
