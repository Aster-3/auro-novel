import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
// Tip tanımını senin paylaştığın GlobalNotification ile güncelledik
import { GlobalNotification } from "@/types/notification";
import { useAppTheme } from "@/hooks/useTheme";
import { formatSmartDate } from "@/utils/formatSmartDate";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useGlobalNotification } from "@/hooks/useGlobalNotification";
import { useTabBarBottomPadding } from "@/utils/useTabBarBottomPadding";
import { useMarkGlobalNotificationsLastSeen } from "@/hooks/useNotificationMutations";
import { getGlobalNotificationDetail } from "@/services/NotificationService";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const GlobalNotifications = () => {
  const { theme, isDarkMode } = useAppTheme();
  const tabBarBottomPadding = useTabBarBottomPadding();
  const { mutate: markLastSeen } = useMarkGlobalNotificationsLastSeen();
  const navigation = useAppNavigation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mountedAtRef = useRef(Date.now());

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGlobalNotification();

  useEffect(() => {
    mountedAtRef.current = Date.now();

    return () => {
      const visibleDuration = Date.now() - mountedAtRef.current;

      if (visibleDuration > 300) {
        markLastSeen();
      }
    };
  }, [markLastSeen]);

  // Global bildirimler genellikle "Sistem" bazlı olduğu için basit bir badge mantığı
  const getBadgeConfig = () => {
    return { label: "SİSTEM", color: theme.accent };
  };

  const openGlobalNotification = useCallback(async (item: GlobalNotification) => {
    const detail: GlobalNotification = await getGlobalNotificationDetail(item.id);

    navigation.navigate("GlobalNotificationDetail", {
      notificationId: item.id,
      initialNotification: detail,
    });
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, index }: { item: GlobalNotification; index: number }) => {
      const badge = getBadgeConfig();
      const isUnread = item.isNew;

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
            onPress={() => {
              void openGlobalNotification(item);
            }}
          >
            {/* Sol kenardaki renkli bar: isNew ise gösterilir */}
            {isUnread && (
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
                    {formatSmartDate(item.publishedAt ?? item.createdAt)}
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
                  {item.summary}
                </Text>
              </View>

              {/* Sağdaki parlayan nokta: isNew ise gösterilir */}
              {isUnread && (
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
    [isDarkMode, openGlobalNotification, theme],
  );

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
      // API response yapısına göre data.items kullanıyoruz
      data={notifications?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={[
        s.container,
        { paddingBottom: tabBarBottomPadding },
      ]}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      // Refreshing kontrolü (isLoading yerine loading durumu için data check de yapılabilir)
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

// Stillerin geri kalanı aynı...

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
