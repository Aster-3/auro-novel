import { deleteVolume } from "@/services/VolumeService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteVolume = (novelId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteVolume(id),
    onSuccess: (data) => {
      console.log("Cilt silindi:", data);
      queryClient.invalidateQueries({ queryKey: ["volumes", novelId] });
    },
    onError: (error: any) => {
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
            firstErrorMessage || "Cilt silinirken doğrulama hatası oluştu.",
        });
        return;
      } else {
        useToastStore.getState().showToast({
          type: "Hata",
          message: "Cilt silinirken bir hata oluştu.",
        });
      }
    },
  });
};
