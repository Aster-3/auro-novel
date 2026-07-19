import { useQuery } from "@tanstack/react-query";
import { getMyComment } from "@/services/commentService";
import { useAuthStore } from "@/store/useAuthStore";

const useMyCommentQuery = (novelId: string) => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["myComment", novelId],
    queryFn: () => getMyComment(novelId),
    enabled: !!novelId && !!accessToken,
  });
};

export default useMyCommentQuery;
