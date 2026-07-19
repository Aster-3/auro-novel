import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import {
  PersonalNotification,
  PersonalNotificationType,
} from "@/types/notification";
import { useAppTheme } from "@/hooks/useTheme";
import { formatSmartDate } from "@/utils/formatSmartDate";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useMyNotifications } from "@/hooks/useMyNotifications";
import { useTabBarBottomPadding } from "@/utils/useTabBarBottomPadding";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useMarkPersonalNotificationAsRead } from "@/hooks/useNotificationMutations";
import { getProfileImageSource } from "@/utils/profileImage";

export const PersonalNotifications = () => {
  const { theme, isDarkMode } = useAppTheme();
  const tabBarBottomPadding = useTabBarBottomPadding();
  const navigation = useAppNavigation();
  const { mutate: markAsRead } = useMarkPersonalNotificationAsRead();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyNotifications();

  const getBadgeConfig = (type: PersonalNotificationType) => {
    switch (type) {
      case PersonalNotificationType.NEW_CHAPTER:
        return { label: "BÖLÜM", color: isDarkMode ? "#FFF" : "#000" };
      case PersonalNotificationType.COMMENT_REPLY:
      case PersonalNotificationType.REPLY_REPLY:
        return { label: "YANIT", color: theme.accent };
      case PersonalNotificationType.COMMENT_LIKE:
      case PersonalNotificationType.REPLY_LIKE:
        return { label: "BEĞENİ", color: "#EF4444" };
      case PersonalNotificationType.FOLLOW:
        return { label: "TAKİP", color: "#10B981" };
      case PersonalNotificationType.MESSAGE:
        return { label: "MESAJ", color: "#6366F1" };
      default:
        return { label: "SOSYAL", color: theme.accent };
    }
  };

  const getNotificationTitle = (item: PersonalNotification) =>
    item.titleSnapshot || item.title || "Yeni bildirim";

  const getNotificationBody = (item: PersonalNotification) =>
    item.bodySnapshot || item.body || "";

  const toNumber = (value?: string | number | null) => {
    if (typeof value === "number") return value;
    if (!value) return null;

    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  };

  const openNotificationTarget = useCallback(
    (item: PersonalNotification) => {
      const data = item.data;

      if (!item.isRead) {
        markAsRead(item.id);
      }

      if (item.type === PersonalNotificationType.NEW_CHAPTER) {
        if (data?.chapterId) {
          navigation.navigate("ChapterRead", { id: data.chapterId });
          return;
        }

        if (data?.novelId) {
          navigation.navigate("Novel", { id: data.novelId });
          return;
        }
      }

      const commentId = toNumber(data?.commentId ?? item.targetId);
      const novelId = data?.novelId ?? null;

      if (
        (item.type === PersonalNotificationType.COMMENT_REPLY ||
          item.type === PersonalNotificationType.COMMENT_LIKE ||
          item.type === PersonalNotificationType.REPLY_REPLY ||
          item.type === PersonalNotificationType.REPLY_LIKE) &&
        novelId
      ) {
        if (
          (item.type === PersonalNotificationType.COMMENT_REPLY ||
            item.type === PersonalNotificationType.REPLY_REPLY ||
            item.type === PersonalNotificationType.REPLY_LIKE) &&
          commentId
        ) {
          navigation.navigate("Reply", { commentId, novelId });
          return;
        }

        navigation.navigate("Comment", { id: novelId });
        return;
      }

      if (data?.userId) {
        navigation.navigate("UserProfile", { userId: data.userId });
        return;
      }

      if (item.type === PersonalNotificationType.FOLLOW && item.actorUserId) {
        navigation.navigate("UserProfile", { userId: item.actorUserId });
      }
    },
    [markAsRead, navigation],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: PersonalNotification; index: number }) => {
      const badge = getBadgeConfig(item.type);
      const title = getNotificationTitle(item);
      const body = getNotificationBody(item);

      return (
        <Animated.View
          entering={FadeInRight.delay((index % 10) * 40).duration(400)}
        >
          <Pressable
            style={({ pressed }) => [
              s.card,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.025)"
                  : "#FBFCFE",
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(3,9,55,0.06)",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => openNotificationTarget(item)}
          >
            {!item.isRead && (
              <View style={[s.unreadBar, { backgroundColor: theme.accent }]} />
            )}

            <View style={s.mainRow}>
              <View
                style={[
                  s.avatar,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(3,9,55,0.05)",
                  },
                ]}
              >
                <Image
                  source={getProfileImageSource(item.actorUser?.profileImageUrl)}
                  style={s.avatarImage}
                  contentFit="cover"
                />
              </View>

              <View style={s.infoSide}>
                <View style={s.topLine}>
                  <Text style={[s.badgeText, { color: badge.color }]}>
                    {badge.label}
                  </Text>
                  <View style={s.dot} />
                  <Text style={[s.date, { color: theme.textSecondary }]}>
                    {formatSmartDate(item.createdAt)}
                  </Text>
                </View>

                <Text
                  style={[s.title, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {title}
                </Text>

                <Text
                  style={[s.body, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {body}
                </Text>
              </View>

              {!item.isRead && (
                <View
                  style={[
                    s.glowDot,
                    {
                      shadowColor: theme.accent,
                      backgroundColor: theme.accent,
                    },
                  ]}
                />
              )}
            </View>
          </Pressable>
        </Animated.View>
      );
    },
    [isDarkMode, openNotificationTarget, theme],
  );

  // Sayfa sonuna gelindiğinde yeni veriyi yükle
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return (
      <View style={s.center}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <FlatList
      data={notifications?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[
        s.container,
        { paddingBottom: tabBarBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
      // Infinite Scroll özellikleri
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={isRefreshing}
      onRefresh={handleRefresh}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator
            style={{ marginVertical: 20 }}
            color={theme.accent}
          />
        ) : null
      }
      ListEmptyComponent={
        <View style={s.emptyArea}>
          <Text style={[s.emptyText, { color: theme.textSecondary }]}>
            BİLDİRİM BULUNAMADI
          </Text>
        </View>
      }
    />
  );
};

const s = StyleSheet.create({
  container: {
    paddingBottom: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    minHeight: 72,
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
  },
  unreadBar: {
    position: "absolute",
    left: 0,
    top: 18,
    bottom: 18,
    width: 2,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  infoSide: {
    flex: 1,
    gap: 1,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },
  badgeText: {
    fontSize: 7,
    fontFamily: "Mont-700",
    letterSpacing: 1.2,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(128,128,128,0.3)",
    marginHorizontal: 8,
  },
  date: {
    fontSize: 9,
    fontFamily: "Mont-600",
    opacity: 0.45,
  },
  title: {
    fontSize: 13,
    fontFamily: "Mont-600",
    letterSpacing: 0,
  },
  body: {
    fontSize: 11,
    fontFamily: "Mont-500",
    opacity: 0.58,
  },
  glowDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginLeft: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyArea: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 10,
    fontFamily: "Mont-800",
    letterSpacing: 3,
    opacity: 0.3,
  },
});
