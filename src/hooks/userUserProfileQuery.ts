import {
  followUser,
  getUserFollowCounts,
  getUserFollowStatus,
  getUserFollowers,
  getUserFollowing,
  getUserProfile,
  getUserPublicLibrary,
  getUserReplies,
  getUserReviews,
  unfollowUser,
} from "@/services/UserService";
import { getNovelsByAuthor } from "@/services/NovelService";
import { UserFollowCounts, UserFollowStatus } from "@/types/user";
import {
  useMutation,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useUserProfileQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => getUserProfile(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserFollowCountsQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user-profile", "follow-counts", userId],
    queryFn: async () => getUserFollowCounts(userId),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUserFollowStatusQuery = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ["user-profile", "follow-status", userId],
    queryFn: async () => getUserFollowStatus(userId),
    enabled: !!userId && enabled,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
  });
};

export const useToggleUserFollowMutation = (userId: string) => {
  const queryClient = useQueryClient();
  const countsKey = ["user-profile", "follow-counts", userId];
  const statusKey = ["user-profile", "follow-status", userId];

  return useMutation({
    mutationFn: async (isFollowing: boolean) =>
      isFollowing ? unfollowUser(userId) : followUser(userId),
    onMutate: async (isFollowing) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: countsKey }),
        queryClient.cancelQueries({ queryKey: statusKey }),
      ]);

      const previousCounts =
        queryClient.getQueryData<UserFollowCounts>(countsKey);
      const previousStatus =
        queryClient.getQueryData<UserFollowStatus>(statusKey);
      const delta = isFollowing ? -1 : 1;

      queryClient.setQueryData<UserFollowCounts>(countsKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          followersCount: Math.max(0, current.followersCount + delta),
        };
      });

      queryClient.setQueryData<UserFollowStatus>(statusKey, (current) => {
        if (!current) return current;
        return {
          ...current,
          isFollowing: !isFollowing,
          followersCount: Math.max(0, current.followersCount + delta),
        };
      });

      return { previousCounts, previousStatus };
    },
    onError: (_error, _isFollowing, context) => {
      if (context?.previousCounts) {
        queryClient.setQueryData(countsKey, context.previousCounts);
      }
      if (context?.previousStatus) {
        queryClient.setQueryData(statusKey, context.previousStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: countsKey });
      queryClient.invalidateQueries({ queryKey: statusKey });
    },
  });
};

export const useUserFollowersQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "followers", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowers({ userId, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useUserFollowingQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "following", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserFollowing({ userId, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useUserReviewsQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "reviews", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserReviews({ userId, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useUserRepliesQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "replies", userId],
    queryFn: ({ pageParam = 1 }) =>
      getUserReplies({ userId, page: pageParam, limit: 20 }),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useUserPublicLibraryQuery = (
  userId: string,
  sortBy?: "LAST_READED" | "TITLE_ASC",
) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "library", userId, sortBy],
    queryFn: ({ pageParam = 1 }) =>
      getUserPublicLibrary({ userId, page: pageParam, limit: 20, sortBy }),
    initialPageParam: 1,
    enabled: !!userId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};

export const useAuthorNovelsQuery = (authorId?: string | null) => {
  return useInfiniteQuery({
    queryKey: ["user-profile", "author-novels", authorId],
    queryFn: ({ pageParam = 1 }) =>
      getNovelsByAuthor({
        authorId: authorId!,
        page: pageParam,
        limit: 20,
      }),
    initialPageParam: 1,
    enabled: !!authorId,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    select: (data) => ({
      items: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
    staleTime: 1000 * 60,
  });
};
