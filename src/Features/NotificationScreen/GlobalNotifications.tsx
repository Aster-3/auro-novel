import React, { useCallback } from "react";
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

export const GlobalNotifications = () => {
  const { theme, isDarkMode } = useAppTheme();

  const {
    data: notifications,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useGlobalNotification();

  // Global bildirimler genellikle "Sistem" bazlı olduğu için basit bir badge mantığı
  const getBadgeConfig = () => {
    return { label: "SİSTEM", color: theme.accent };
  };

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
                  ? "rgba(255,255,255,0.03)"
                  : "#F8FAFC",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            onPress={() => {
              console.log("Navigating to:", item.data?.screen, item.data?.id);
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
    [isDarkMode, theme],
  );

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
      // API response yapısına göre data.items kullanıyoruz
      data={notifications?.items || []}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={s.container}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      // Refreshing kontrolü (isLoading yerine loading durumu için data check de yapılabilir)
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

// Stillerin geri kalanı aynı...

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
