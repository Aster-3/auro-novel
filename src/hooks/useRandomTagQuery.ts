import { getRandomTags } from "@/services/TagService";
import { useQuery } from "@tanstack/react-query";

export const useRandomTagQuery = (limit?: number) => {
  return useQuery({
    queryKey: ["random-tags", limit],
    queryFn: () => getRandomTags(limit),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};
