import { getChapterSummary } from "@/services/ChapterService";
import { ChapterSummary } from "@/types/chapter";
import { useQuery } from "@tanstack/react-query";

export const useChapterSummary = (id: string) => {
  return useQuery<ChapterSummary>({
    queryKey: ["chapterSummary", id],
    queryFn: () => getChapterSummary(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
