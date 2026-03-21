import { useQuery } from "@tanstack/react-query";
import { getMyComment } from "@/services/commentService";

const useMyCommentQuery = (novelId: string) => {
  return useQuery({
    queryKey: ["myComment", novelId],
    queryFn: () => getMyComment(novelId),
  });
};

export default useMyCommentQuery;
