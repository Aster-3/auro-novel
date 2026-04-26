import React, { useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  PersonalNotification,
  PersonalNotificationType,
} from "@/types/notification";
import { useAppTheme } from "@/hooks/useTheme";
import { formatSmartDate } from "@/utils/formatSmartDate";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useMyNotifications } from "@/hooks/useMyNotifications";

export const PersonalNotifications = () => {
  const { theme, isDarkMode } = useAppTheme();

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
        return { label: "NOVEL", color: isDarkMode ? "#FFF" : "#000" };
      case PersonalNotificationType.PAYMENT_SUCCESS:
      case PersonalNotificationType.PAYMENT_REQUEST:
      case PersonalNotificationType.PAYMENT_FAILURE:
        return { label: "ÖDEME", color: "#10B981" };
      default:
        return { label: "SOSYAL", color: theme.accent };
    }
  };

  const renderItem = useCallback(
    ({ item, index }: { item: PersonalNotification; index: number }) => {
      const badge = getBadgeConfig(item.type);

      return (
        <Animated.View
          entering={FadeInRight.delay((index % 10) * 40).duration(400)}
        >
          <Pressable
            style={({ pressed }) => [
              s.card,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.03)"
                  : "#F8FAFC",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => {
              /* Bildirim tıklama mantığı buraya */
            }}
          >
            {!item.isRead && (
              <View style={[s.unreadBar, { backgroundColor: theme.accent }]} />
            )}

            <View style={s.mainRow}>
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
                  {item.title}
                </Text>

                <Text
                  style={[s.body, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.body}
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
    [isDarkMode, theme],
  );

  // Sayfa sonuna gelindiğinde yeni veriyi yükle
  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

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
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      // Infinite Scroll özellikleri
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshing={isLoading}
      onRefresh={refetch}
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
    paddingBottom: 104,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 90,
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    overflow: "hidden",
  },
  unreadBar: {
    position: "absolute",
    left: 0,
    top: "30%",
    bottom: "30%",
    width: 3,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoSide: {
    flex: 1,
    gap: 2,
  },
  topLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    fontSize: 10,
    fontFamily: "Mont-600",
    opacity: 0.4,
  },
  title: {
    fontSize: 14,
    fontFamily: "Mont-600",
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 12,
    fontFamily: "Mont-500",
    opacity: 0.6,
  },
  glowDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 12,
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
