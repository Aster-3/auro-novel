import { getChapterDetail } from "@/services/ChapterService";
import { keepPreviousData } from "@tanstack/react-query";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

export const useGetOneChapter = (id: string | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: ["chapterDetail", id],
    queryFn: () => getChapterDetail(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: enabled,
    placeholderData: keepPreviousData,
  });
};
