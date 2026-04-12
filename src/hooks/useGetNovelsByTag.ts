import { getNovelsByTag } from "@/services/NovelService";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

export const useGetNovelsByTag = (tagId: string) => {
  return useQuery({
    queryKey: ["novelsByTag", tagId],
    queryFn: () => getNovelsByTag(tagId),
    staleTime: "static",
  });
};
