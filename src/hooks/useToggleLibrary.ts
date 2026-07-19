import { toggleNovelInLibrary } from "@/services/UserService";
import { LibrarySortOption } from "@/types/library";
import type { QueryKey } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useToggleLibrary = (
  novelId: string,
  orderType?: LibrarySortOption,
) => {
  const queryClient = useQueryClient();
  const libraryQueryKey = orderType
    ? (["my-library", orderType] as const)
    : (["my-library"] as const);

  return useMutation({
    mutationFn: () => toggleNovelInLibrary(novelId),
    onMutate: async () => {
      // 1. Sorguları durdur
      await queryClient.cancelQueries({ queryKey: libraryQueryKey });
      await queryClient.cancelQueries({ queryKey: ["library-check", novelId] });

      const previousLibraries = queryClient.getQueriesData({
        queryKey: libraryQueryKey,
      });
      const previousCheck = queryClient.getQueryData([
        "library-check",
        novelId,
      ]);

      // 2. GERÇEK DURUM KONTROLÜ: Listede bu novel var mı?
      const isInLibraryList = previousLibraries.some(([, library]: any) =>
        library?.pages?.some((page: any) =>
          page.items.some((item: any) => item.novelId === novelId),
        ),
      );

      // 3. OPTIMISTIC UPDATE (Sadece SİLERKEN yapıyoruz ki titremesin)
      if (isInLibraryList) {
        queryClient.setQueriesData(
          { queryKey: libraryQueryKey },
          (oldData: any) => {
            if (!oldData) return oldData;
            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                items: page.items.filter(
                  (item: any) => item.novelId !== novelId,
                ),
              })),
            };
          },
        );
      }

      // Ikonun hemen değişmesi için (Hangi durumdaysa tersine çevir)
      queryClient.setQueryData(["library-check", novelId], (old: any) => !old);

      return { previousLibraries, previousCheck, isInLibraryList };
    },

    onError: (err, variables, context) => {
      context?.previousLibraries?.forEach(
        ([queryKey, data]: [QueryKey, unknown]) => {
          queryClient.setQueryData(queryKey, data);
        },
      );
      queryClient.setQueryData(
        ["library-check", novelId],
        context?.previousCheck,
      );
    },

    onSettled: (data, error, variables, context) => {
      // 4. SONUÇ:
      // Eğer EKLEME yaptıysak listeyi tazele (Yeni gelen verinin formatı tam olsun diye)
      // Eğer SİLME yaptıysak zaten yukarıda sildik, sadece arkada sessizce doğrula
      queryClient.invalidateQueries({ queryKey: libraryQueryKey });
      queryClient.invalidateQueries({ queryKey: ["library-check", novelId] });
    },
  });
};
