import { RedirectReplyIcon } from "@/components/icons/RedirectReplyIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useUserRepliesQuery } from "@/hooks/userUserProfileQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { UserProfileReply } from "@/types/user";
import { formatSmartDate } from "@/utils/formatSmartDate";
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

export const ProfileSeedComments = React.memo(
  ({ userId }: { userId: string }) => {
    const { theme, isDarkMode } = useAppTheme();
    const navigation = useAppNavigation();
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
      useUserRepliesQuery(userId);
    const canFetchNextPageRef = useRef(false);

    const handleEndReached = useCallback(() => {
      if (canFetchNextPageRef.current && hasNextPage && !isFetchingNextPage) {
        canFetchNextPageRef.current = false;
        fetchNextPage();
      }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleScrollBegin = useCallback(() => {
      canFetchNextPageRef.current = true;
    }, []);

    const openNovel = useCallback(
      (item: UserProfileReply) => {
        navigation.navigate("Novel", { id: item.novel.id });
      },
      [navigation],
    );

    const openDiscussion = useCallback(
      (item: UserProfileReply) => {
        navigation.navigate("Reply", {
          commentId: item.rootComment.id,
          novelId: item.novel.id,
        });
      },
      [navigation],
    );

    const renderItem = useCallback(
      ({ item }: { item: UserProfileReply }) => (
        <View style={styles.card}>
          <Pressable
            onPress={() => openNovel(item)}
            style={({ pressed }) => [
              styles.coverTarget,
              pressed && styles.targetPressed,
            ]}
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
          </Pressable>

          <View style={styles.content}>
            <View style={styles.header}>
              <Pressable
                onPress={() => openNovel(item)}
                style={({ pressed }) => [
                  styles.titleTarget,
                  pressed && styles.targetPressed,
                ]}
              >
                <Text
                  style={[styles.title, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {item.novel.name}
                </Text>
              </Pressable>
              <Text
                style={[styles.date, { color: theme.textSecondary }]}
                numberOfLines={1}
              >
                {formatSmartDate(item.createdAt).toUpperCase()}
              </Text>
            </View>

            <View
              style={[
                styles.quote,
                {
                  borderLeftColor: isDarkMode
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(15,63,146,0.18)",
                },
              ]}
            >
              <Text style={[styles.quoteName, { color: theme.textSecondary }]}>
                {item.parentReply
                  ? item.parentReply.isDeleted
                    ? "silinmiş"
                    : item.parentReply.user.nickname
                  : "Ana yorum"}
              </Text>
              <Text
                style={[styles.quoteText, { color: theme.textSecondary }]}
                numberOfLines={2}
              >
                {item.parentReply
                  ? item.parentReply.isDeleted
                    ? "Bu içerik kaldırıldı."
                    : item.parentReply.content || "Boş yanıt"
                  : item.rootComment.content}
              </Text>
            </View>

            <Pressable
              onPress={() => openDiscussion(item)}
              style={({ pressed }) => pressed && styles.targetPressed}
            >
              <Text
                style={[styles.replyText, { color: theme.textPrimary }]}
                numberOfLines={4}
              >
                {item.content}
              </Text>
            </Pressable>

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && styles.actionPressed,
                ]}
                onPress={() => openDiscussion(item)}
              >
                <RedirectReplyIcon color={theme.textSecondary} size={15} />
                <Text
                  style={[styles.actionText, { color: theme.textSecondary }]}
                >
                  KONUYA GİT
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      ),
      [
        isDarkMode,
        openDiscussion,
        openNovel,
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
              title="Henüz yorum yok"
              text="Bu kullanıcı henüz yanıt paylaşmamış."
            />
          )
        }
      />
    );
  },
);

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
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  coverTarget: {
    width: 48,
    height: 70,
  },
  cover: {
    width: 48,
    height: 70,
    borderRadius: 9,
  },
  targetPressed: {
    opacity: 0.72,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titleTarget: {
    flex: 1,
  },
  title: {
    fontFamily: "Mont-700",
    fontSize: 14,
  },
  date: {
    flexShrink: 0,
    fontFamily: "Mont-800",
    fontSize: 8,
    letterSpacing: 0.5,
  },
  quote: {
    borderLeftWidth: 2.5,
    paddingLeft: 10,
    paddingVertical: 2,
  },
  quoteName: {
    fontFamily: "Mont-800",
    fontSize: 10,
    opacity: 0.72,
  },
  quoteText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    lineHeight: 16,
    opacity: 0.62,
  },
  replyText: {
    fontFamily: "Mont-500",
    fontSize: 12.5,
    lineHeight: 19,
  },
  actions: {
    flexDirection: "row",
    gap: 14,
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
