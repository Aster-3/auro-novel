import React, { useCallback, useDeferredValue, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
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
  }: {
    item: LibraryItem;
    onPress: (data: LibrarySheetData) => void;
    theme: any;
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
        <View style={[s.imageWrapper, { backgroundColor: theme.surface }]}>
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
  (prev, next) => prev.item.novelId === next.item.novelId,
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
  const { data: libraryNovels, isLoading, error } = useMyLibrary(orderType);
  const { theme, isDarkMode } = useAppTheme();
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchText);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchText);
    }, 150);

    return () => clearTimeout(handler);
  }, [searchText]);

  const filteredData = useMemo(() => {
    const allItems = libraryNovels?.items || [];
    if (!debouncedQuery || debouncedQuery.trim() === "") return allItems;

    const query = debouncedQuery.toLowerCase().trim();
    return allItems.filter((item: any) =>
      item.title.toLowerCase().includes(query),
    );
  }, [debouncedQuery, libraryNovels?.items]);

  const renderItem = useCallback(
    ({ item }: { item: LibraryItem }) => (
      <LibraryCard item={item} theme={theme} onPress={openLibrarySheet} />
    ),
    [theme, openLibrarySheet],
  );

  if (isLoading && !libraryNovels) {
    return (
      <View style={s.listContent}>
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
      data={filteredData}
      keyExtractor={(item: LibraryItem) => item.novelId}
      numColumns={NUM_COLUMNS}
      itemLayoutAnimation={CARD_LAYOUT} // ← tüm liste için layout animasyonu
      contentContainerStyle={s.listContent}
      columnWrapperStyle={s.columnWrapper}
      showsVerticalScrollIndicator={false}
      renderItem={renderItem}
      ListEmptyComponent={
        searchText ? (
          <View style={s.center}>
            <Text style={{ color: theme.textSecondary }}>
              Sonuç bulunamadı.
            </Text>
          </View>
        ) : null
      }
    />
  );
};

const s = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
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
    borderColor: "rgba(255,255,255,0.05)",
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
    paddingTop: 50,
    alignItems: "center",
  },
  skeletonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: GAP,
  },
});
