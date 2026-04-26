import { isNovelInLibrary } from "@/services/UserService";
import { useQuery } from "@tanstack/react-query";

export const useLibraryCheck = (novelId: string) => {
  return useQuery({
    queryKey: ["library-check", novelId],
    queryFn: async () => isNovelInLibrary(novelId),
    select: (data) => data.exists,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
