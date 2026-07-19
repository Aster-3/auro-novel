import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useUserPublicLibraryQuery } from "@/hooks/userUserProfileQuery";
import { useAppTheme } from "@/hooks/useTheme";
import { UserPublicLibraryItem } from "@/types/user";
import { Image } from "expo-image";
import React, { useCallback, useRef } from "react";
import { Tabs } from "react-native-collapsible-tab-view";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const PADDING_HORIZONTAL = 12; // Ekranın en sol ve sağındaki boşluk
const GAP = 12; // Kartların kendi arasındaki boşluk

// 3 sütun için toplam boşluk: Sol kenar (12) + Sağ kenar (12) + Sütunlar arası 2 boşluk (12 * 2) = 48
const CARD_WIDTH =
  (width - (PADDING_HORIZONTAL * 2 + GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

export const ProfileSeedLibrary = React.memo(
  ({ userId }: { userId: string }) => {
    const { theme, isDarkMode } = useAppTheme();
    const navigation = useAppNavigation();
    const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
      useUserPublicLibraryQuery(userId);
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

    const renderItem = useCallback(
      ({ item }: { item: UserPublicLibraryItem; index: number }) => (
        <Pressable
          style={({ pressed }) => [
            styles.card,
            {
              width: CARD_WIDTH,
            },
            pressed && styles.cardPressed,
          ]}
          onPress={() => navigation.navigate("Novel", { id: item.novelId })}
        >
          <View
            style={[
              styles.imageWrapper,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "#F1F5F9",
                borderColor: isDarkMode ? "rgba(255,255,255,0.07)" : "#E5E7EB",
              },
            ]}
          >
            <Image
              source={{ uri: item.coverImageUrl ?? undefined }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              transition={0}
            />
          </View>
          <Text
            style={[styles.title, { color: theme.textPrimary }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>
        </Pressable>
      ),
      [isDarkMode, navigation, theme.textPrimary],
    );

    return (
      <Tabs.FlashList
        data={isLoading ? [] : (data?.items ?? [])}
        keyExtractor={(item) => item.novelId}
        renderItem={renderItem}
        numColumns={NUM_COLUMNS}
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
              title="Kütüphane boş"
              text="Bu kullanıcının herkese açık kütüphane öğesi yok."
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
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: 28,
    marginTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 22,
  },
  cardPressed: {
    opacity: 0.76,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    marginTop: 8,
    letterSpacing: -0.2,
    paddingHorizontal: 2,
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
