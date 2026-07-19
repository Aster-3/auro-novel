import {
  createAuthor,
  getAuthorMe,
  getMyAuthorNovels,
} from "@/services/AuthorService";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const AUTHOR_ME_QUERY_KEY = ["authors", "me"];
export const MY_AUTHOR_NOVELS_QUERY_KEY = ["authors", "me", "novels"];

export const useAuthorMeQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: AUTHOR_ME_QUERY_KEY,
    queryFn: getAuthorMe,
    staleTime: 1000 * 60,
    retry: false,
    enabled: options?.enabled,
  });
};

export const useCreateAuthorMutation = () => {
  const queryClient = useQueryClient();
  const nickname = useAuthStore((state) => state.user?.nickname);

  return useMutation({
    mutationFn: () => createAuthor(nickname ? { nickname } : undefined),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: AUTHOR_ME_QUERY_KEY });
      await queryClient.refetchQueries({ queryKey: AUTHOR_ME_QUERY_KEY });
      await queryClient.resetQueries({ queryKey: ["user-profile"] });
      await queryClient.resetQueries({
        queryKey: ["user-profile", "author-novels"],
      });
      await queryClient.resetQueries({
        queryKey: MY_AUTHOR_NOVELS_QUERY_KEY,
      });

      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Yazar panelin hazırlandı.",
      });
    },
    onError: () => {
      useToastStore.getState().showToast({
        type: "Hata",
        message: "Yazar hesabı oluşturulamadı. Lütfen tekrar deneyin.",
      });
    },
  });
};

export const useMyAuthorNovelsQuery = (options?: { enabled?: boolean }) => {
  return useInfiniteQuery({
    queryKey: MY_AUTHOR_NOVELS_QUERY_KEY,
    queryFn: ({ pageParam = 1 }) =>
      getMyAuthorNovels({ page: pageParam, limit: 20 }),
    initialPageParam: 1,
    enabled: options?.enabled,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};
