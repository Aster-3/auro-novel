import { isNovelInLibrary } from "@/services/UserService";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";

export const useLibraryCheck = (novelId: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["library-check", novelId],
    queryFn: async () => isNovelInLibrary(novelId),
    enabled: !!novelId && !!accessToken,
    select: (data) => data.exists,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
