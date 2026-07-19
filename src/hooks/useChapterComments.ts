import {
  createChapterComment,
  createChapterReply,
  deleteChapterComment,
  getChapterCommentReplies,
  getChapterComments,
  toggleChapterCommentLike,
} from "@/services/chapterCommentService";
import { useToastStore } from "@/store/useToastStore";
import { ChapterComment } from "@/types/chapterComment";
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const updateCommentPages = (
  old: InfiniteData<any> | undefined,
  commentId: number,
  update: (comment: ChapterComment) => ChapterComment | null,
) => {
  if (!old) return old;

  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      items: page.items
        .map((item: ChapterComment) =>
          item.id === commentId ? update(item) : item,
        )
        .filter(Boolean),
    })),
  };
};

export const useInfiniteChapterComments = (chapterId: string) => {
  return useInfiniteQuery({
    queryKey: ["chapter-comments", "list", chapterId],
    queryFn: ({ pageParam }) =>
      getChapterComments({ chapterId, page: pageParam, limit: 20 }),
    enabled: !!chapterId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useInfiniteChapterCommentReplies = (
  rootCommentId: number,
  enabled: boolean,
) => {
  return useInfiniteQuery({
    queryKey: ["chapter-comments", "replies", rootCommentId],
    queryFn: ({ pageParam }) =>
      getChapterCommentReplies({
        commentId: rootCommentId,
        page: pageParam,
        limit: 20,
      }),
    enabled: enabled && !!rootCommentId,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useCreateChapterCommentMutation = (chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createChapterComment({ chapterId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-comments", "list", chapterId],
      });
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Yorumun gonderildi.",
      });
    },
  });
};

export const useCreateChapterReplyMutation = (chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChapterReply,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter-comments", "replies", variables.rootCommentId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter-comments", "list", chapterId],
      });
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Yanitin gonderildi.",
      });
    },
  });
};

export const useChapterCommentLikeMutation = (chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => toggleChapterCommentLike(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["chapter-comments", "list", chapterId],
      });

      const previousComments = queryClient.getQueryData([
        "chapter-comments",
        "list",
        chapterId,
      ]);

      queryClient.setQueryData(
        ["chapter-comments", "list", chapterId],
        (old: InfiniteData<any> | undefined) =>
          updateCommentPages(old, commentId, (item) => ({
            ...item,
            viewerHasLiked: !item.viewerHasLiked,
            likeCount: item.viewerHasLiked
              ? Math.max(0, item.likeCount - 1)
              : item.likeCount + 1,
          })),
      );

      queryClient.setQueriesData(
        { queryKey: ["chapter-comments", "replies"] },
        (old: InfiniteData<any> | undefined) =>
          updateCommentPages(old, commentId, (item) => ({
            ...item,
            viewerHasLiked: !item.viewerHasLiked,
            likeCount: item.viewerHasLiked
              ? Math.max(0, item.likeCount - 1)
              : item.likeCount + 1,
          })),
      );

      return { previousComments };
    },
    onError: (_error, _commentId, context) => {
      queryClient.setQueryData(
        ["chapter-comments", "list", chapterId],
        context?.previousComments,
      );
    },
  });
};

export const useDeleteChapterCommentMutation = (chapterId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: number) => deleteChapterComment(commentId),
    onSuccess: (_, commentId) => {
      queryClient.setQueryData(
        ["chapter-comments", "list", chapterId],
        (old: InfiniteData<any> | undefined) =>
          updateCommentPages(old, commentId, (item) =>
            item.replyCount > 0
              ? { ...item, content: null, isDeleted: true }
              : null,
          ),
      );
      queryClient.invalidateQueries({
        queryKey: ["chapter-comments", "list", chapterId],
      });
      queryClient.invalidateQueries({
        queryKey: ["chapter-comments", "replies"],
      });
      useToastStore.getState().showToast({
        type: "Başarılı",
        message: "Yorum silindi.",
      });
    },
  });
};
