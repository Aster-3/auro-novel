import { CommentLikeIcon } from "@/components/icons/CommentLikeIcon";
import { RecommendIcon } from "@/components/icons/RecommendIcon";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useRequireAuthAction } from "@/hooks/useRequireAuthAction";
import { useUserReviewsQuery } from "@/hooks/userUserProfileQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { toggleLike } from "@/services/commentService";
import { UserProfileReview } from "@/types/user";
import { formatSmartDate } from "@/utils/formatSmartDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React, { useCallback, useRef } from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export const ProfileSeedReview = React.memo(({ userId }: { userId: string }) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const queryClient = useQueryClient();
  const { requireAuth } = useRequireAuthAction();
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserReviewsQuery(userId);
  const canFetchNextPageRef = useRef(false);

  const { mutate: likeReview } = useMutation({
    mutationFn: (commentId: number) => toggleLike(commentId),
    onSuccess: (_data, commentId) => {
      queryClient.invalidateQueries({
        queryKey: ["user-profile", "reviews", userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["comment", commentId],
      });
    },
  });

  const handleEndReached = useCallback(() => {
    if (canFetchNextPageRef.current && hasNextPage && !isFetchingNextPage) {
      canFetchNextPageRef.current = false;
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleScrollBegin = useCallback(() => {
    canFetchNextPageRef.current = true;
  }, []);

  const handleLike = useCallback(
    (item: UserProfileReview) => {
      requireAuth(
        () => likeReview(item.id),
        "Beğenmek için giriş yapmalısın.",
      );
    },
    [likeReview, requireAuth],
  );

  const handleReply = useCallback(
    (item: UserProfileReview) => {
      requireAuth(
        () =>
          navigation.navigate("WriteReply", {
            commentId: item.id,
            novelId: item.novel.id,
            replyPreview: item.content,
          }),
        "Yanıt yazmak için giriş yapmalısın.",
      );
    },
    [navigation, requireAuth],
  );

  const renderItem = useCallback(
    ({ item }: { item: UserProfileReview }) => (
      <View style={styles.card}>
        <Pressable
          style={({ pressed }) => [
            styles.reviewTarget,
            pressed && styles.reviewTargetPressed,
          ]}
          onPress={() => navigation.navigate("Novel", { id: item.novel.id })}
        >
          <Image
            source={{ uri: item.novel.coverImageUrl ?? undefined }}
            style={[
              styles.cover,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "#F1F5F9",
              },
            ]}
            contentFit="cover"
          />
          <View style={styles.content}>
            <View style={styles.topRow}>
              <Text
                style={[styles.title, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {item.novel.name}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: item.isRecommend
                      ? "rgba(16,185,129,0.1)"
                      : "rgba(225,29,72,0.08)",
                    transform: [
                      { rotate: item.isRecommend ? "0deg" : "180deg" },
                    ],
                  },
                ]}
              >
                <RecommendIcon
                  size={13}
                  color={item.isRecommend ? "#0ab17c" : "#BE123C"}
                />
              </View>
            </View>
            <Text
              style={[styles.date, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {formatSmartDate(item.createdAt).toUpperCase()}
            </Text>
            <Text
              style={[styles.reviewText, { color: theme.textPrimary }]}
              numberOfLines={4}
            >
              {item.content}
            </Text>
          </View>
        </Pressable>

        <View style={styles.actionContent}>
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                handleLike(item);
              }}
            >
              <CommentLikeIcon
                isLiked={item.viewerHasLiked}
                color={item.viewerHasLiked ? "#0064f1" : theme.textSecondary}
                size={15}
              />
              <Text
                style={[
                  styles.actionText,
                  {
                    color: item.viewerHasLiked
                      ? "#0064f1"
                      : theme.textSecondary,
                  },
                ]}
              >
                {item.likeCount || "BEĞEN"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.actionItem,
                pressed && styles.actionPressed,
              ]}
              onPress={() => {
                handleReply(item);
              }}
            >
              <ReplyIcon color={theme.textSecondary} size={15} />
              <Text style={[styles.actionText, { color: theme.textSecondary }]}>
                {item.replyCount || "YANITLA"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    ),
    [
      handleLike,
      handleReply,
      isDarkMode,
      navigation,
      theme.textPrimary,
      theme.textSecondary,
    ],
  );

  return (
    <Tabs.FlashList
      data={isLoading ? [] : (data?.items ?? [])}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      scrollEventThrottle={16}
      onScrollBeginDrag={handleScrollBegin}
      onMomentumScrollBegin={handleScrollBegin}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.12}
      maintainVisibleContentPosition={{ disabled: true }}
      ListFooterComponent={
        isLoading || isFetchingNextPage ? <LoadingState compact /> : null
      }
      ListEmptyComponent={
        isLoading ? null : (
          <EmptyState
            title="Henüz inceleme yok"
            text="Bu kullanıcı henüz seri incelemesi paylaşmamış."
          />
        )
      }
    />
  );
});

const LoadingState = ({ compact = false }: { compact?: boolean }) => {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.center, compact && styles.compactCenter]}>
      <ActivityIndicator color={theme.textPrimary} />
    </View>
  );
};

const EmptyState = ({ title, text }: { title: string; text: string }) => {
  const { theme } = useAppTheme();
  return (
    <View style={styles.center}>
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 28,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  card: {
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  reviewTarget: {
    flexDirection: "row",
    gap: 12,
  },
  reviewTargetPressed: {
    opacity: 0.76,
  },
  cover: {
    width: 56,
    height: 82,
    borderRadius: 10,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    fontFamily: "Mont-700",
    fontSize: 14,
  },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  date: {
    fontFamily: "Mont-800",
    fontSize: 8,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  reviewText: {
    fontFamily: "Mont-500",
    fontSize: 12.5,
    lineHeight: 19,
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 14,
    marginTop: 10,
  },
  actionContent: {
    marginLeft: 68,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingRight: 8,
  },
  actionPressed: {
    opacity: 0.65,
  },
  actionText: {
    fontFamily: "Mont-800",
    fontSize: 9,
  },
  center: {
    flex: 1,
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  compactCenter: {
    minHeight: 56,
  },
  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
