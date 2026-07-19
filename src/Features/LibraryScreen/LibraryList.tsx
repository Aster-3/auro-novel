import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { useAppTheme } from "@/hooks/useTheme";
import { LibrarySheetData } from "./CustomLibrarySheet";
import { useMyLibrary } from "@/hooks/useMyLibrary";
import { LibraryItem, LibrarySortOption } from "@/types/library";
import { SkeletonBox } from "@/components/SkeletonBox";
import { useTabBarBottomPadding } from "@/utils/useTabBarBottomPadding";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const GAP = 12;
const CARD_WIDTH = (width - GAP * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

const CARD_LAYOUT = LinearTransition.duration(250).easing(
  Easing.out(Easing.cubic),
);

const FADE_IN = FadeIn.duration(220).easing(Easing.out(Easing.cubic));
const FADE_OUT = FadeOut.duration(160).easing(Easing.in(Easing.cubic));

const LibraryCard = React.memo(
  ({
    item,
    onPress,
    theme,
    isDarkMode,
  }: {
    item: LibraryItem;
    onPress: (data: LibrarySheetData) => void;
    theme: any;
    isDarkMode: boolean;
  }) => (
    <Animated.View
      layout={CARD_LAYOUT}
      entering={FADE_IN}
      exiting={FADE_OUT}
      style={[s.card, { width: CARD_WIDTH }]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          onPress({
            id: item.novelId,
            title: item.title,
            coverImageUrl: item.coverImageUrl,
            authorName: item.authorName,
          })
        }
      >
        <View
          style={[
            s.imageWrapper,
            {
              backgroundColor: theme.surface,
              borderColor: isDarkMode
                ? "rgba(255,255,255,0.07)"
                : "#E5E7EB",
            },
          ]}
        >
          <Image
            source={{ uri: item.coverImageUrl }}
            style={s.image}
            contentFit="cover"
            transition={200}
          />
        </View>
        <Text
          numberOfLines={2}
          style={[s.nameText, { color: theme.textPrimary }]}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  ),
  (prev, next) =>
    prev.item.novelId === next.item.novelId &&
    prev.theme.textPrimary === next.theme.textPrimary &&
    prev.theme.surface === next.theme.surface &&
    prev.isDarkMode === next.isDarkMode,
);

const AnimatedFlatList = Animated.createAnimatedComponent(
  require("react-native").FlatList,
) as any;

export const LibraryList = ({
  searchText,
  orderType,
  openLibrarySheet,
}: {
  searchText: string | null;
  orderType: LibrarySortOption;
  openLibrarySheet: (data: LibrarySheetData) => void;
}) => {
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchText);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchText);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  const normalizedSearch = debouncedQuery?.trim() ?? "";
  const apiSearchText =
    normalizedSearch.length >= 2 ? normalizedSearch : null;

  const {
    data: libraryNovels,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useMyLibrary(orderType, apiSearchText);
  const { theme, isDarkMode } = useAppTheme();
  const tabBarBottomPadding = useTabBarBottomPadding();
  const data = libraryNovels?.items || [];

  const renderItem = useCallback(
    ({ item }: { item: LibraryItem }) => (
      <LibraryCard
        item={item}
        theme={theme}
        isDarkMode={isDarkMode}
        onPress={openLibrarySheet}
      />
    ),
    [theme, isDarkMode, openLibrarySheet],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading && !libraryNovels) {
    return (
      <View style={[s.listContent, { paddingBottom: tabBarBottomPadding }]}>
        <View style={s.skeletonRow}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View key={i} style={[s.card, { width: CARD_WIDTH }]}>
              <SkeletonBox
                width="100%"
                style={{
                  aspectRatio: 2 / 3,
                  borderRadius: 16,
                  backgroundColor: isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#F1F5F9",
                }}
              />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <AnimatedFlatList
      data={data}
      keyExtractor={(item: LibraryItem) => item.novelId}
      numColumns={NUM_COLUMNS}
      itemLayoutAnimation={CARD_LAYOUT} // ← tüm liste için layout animasyonu
      contentContainerStyle={[
        s.listContent,
        { paddingBottom: tabBarBottomPadding },
      ]}
      columnWrapperStyle={s.columnWrapper}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.35}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View style={s.footerLoader}>
            <ActivityIndicator color={theme.textPrimary} />
          </View>
        ) : null
      }
      ListEmptyComponent={
        normalizedSearch.length >= 2 ? (
          <View style={s.center}>
            <Text style={[s.emptyTitle, { color: theme.textPrimary }]}>
              Sonuç bulunamadı
            </Text>
            <Text style={[s.emptyText, { color: theme.textSecondary }]}>
              {searchText}
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const s = StyleSheet.create({
  listContent: {
    paddingBottom: 0,
  },
  columnWrapper: {
    justifyContent: "flex-start",
    gap: GAP,
  },
  card: {
    marginBottom: 20,
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontFamily: "Mont-600",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
    marginTop: 8,
  },
  center: {
    flex: 1,
    paddingTop: 72,
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginBottom: 6,
  },
  emptyText: {
    fontFamily: "Mont-500",
    fontSize: 12,
  },
  skeletonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
  footerLoader: {
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
  },
});
