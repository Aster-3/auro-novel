import { getNovelsByTag } from "@/services/NovelService";
import { useQuery } from "@tanstack/react-query";

export const useGetNovelsByTag = (tagId: string) => {
  return useQuery({
    queryKey: ["novelsByTag", tagId],
    queryFn: () => getNovelsByTag(tagId),
    staleTime: "static",
    enabled: !!tagId,
  });
};
