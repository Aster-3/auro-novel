import { getDraftChapterDetail } from "@/services/ChapterService";
import { useQuery } from "node_modules/@tanstack/react-query/build/modern/useQuery";

export const useGetOneDraftChapter = (id?: string, enabled?: boolean) => {
  return useQuery({
    queryKey: ["draftChapterDetail", id],
    queryFn: () => getDraftChapterDetail(id!),
    staleTime: 1000 * 60 * 5,
    retry: false,
    enabled: enabled,
  });
};
