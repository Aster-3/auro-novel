import { toggleNovelInLibrary } from "@/services/UserService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleLibrary = (novelId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleNovelInLibrary(novelId),
    onMutate: async () => {
      // 1. Sorguları durdur
      await queryClient.cancelQueries({ queryKey: ["my-library"] });
      await queryClient.cancelQueries({ queryKey: ["library-check", novelId] });

      const previousLibrary: any = queryClient.getQueryData(["my-library"]);
      const previousCheck = queryClient.getQueryData([
        "library-check",
        novelId,
      ]);

      // 2. GERÇEK DURUM KONTROLÜ: Listede bu novel var mı?
      const isInLibraryList = previousLibrary?.pages?.some((page: any) =>
        page.items.some((item: any) => item.novelId === novelId),
      );

      // 3. OPTIMISTIC UPDATE (Sadece SİLERKEN yapıyoruz ki titremesin)
      if (isInLibraryList) {
        queryClient.setQueryData(["my-library"], (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: page.items.filter((item: any) => item.novelId !== novelId),
            })),
          };
        });
      }

      // Ikonun hemen değişmesi için (Hangi durumdaysa tersine çevir)
      queryClient.setQueryData(["library-check", novelId], (old: any) => !old);

      return { previousLibrary, previousCheck, isInLibraryList };
    },

    onError: (err, variables, context) => {
      if (context?.previousLibrary) {
        queryClient.setQueryData(["my-library"], context.previousLibrary);
      }
      queryClient.setQueryData(
        ["library-check", novelId],
        context?.previousCheck,
      );
    },

    onSettled: (data, error, variables, context) => {
      // 4. SONUÇ:
      // Eğer EKLEME yaptıysak listeyi tazele (Yeni gelen verinin formatı tam olsun diye)
      // Eğer SİLME yaptıysak zaten yukarıda sildik, sadece arkada sessizce doğrula
      if (!context?.isInLibraryList) {
        queryClient.invalidateQueries({ queryKey: ["my-library"] });
      }
      queryClient.invalidateQueries({ queryKey: ["library-check", novelId] });
    },
  });
};
