import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import { RouteProp, useRoute } from "@react-navigation/native";
import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { RootStackParamList } from "@/constants/navigation";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { useTagNovels } from "@/hooks/useTagNovels";
import { TaggedNovel } from "@/types/tag";
import { Screen } from "@/components/layout/Screen";

const CARD_GAP = 12;
const NUM_COLUMNS = 3;
const CARD_WIDTH =
  (Dimensions.get("window").width - 24 - CARD_GAP * (NUM_COLUMNS - 1)) /
  NUM_COLUMNS;

const TagNovelCard = React.memo(({ item }: { item: TaggedNovel }) => {
  const navigation = useAppNavigation();
  const { theme } = useAppTheme();

  return (
    <Pressable
      onPress={() => navigation.navigate("Novel", { id: item.id })}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.coverWrap, { backgroundColor: theme.surface }]}>
        {item.coverImage ? (
          <Image
            source={{ uri: item.coverImage }}
            style={styles.cover}
            contentFit="cover"
            transition={180}
          />
        ) : (
          <View style={styles.coverFallback}>
            <Text
              style={[styles.coverFallbackText, { color: theme.textSecondary }]}
            >
              #
            </Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text
          numberOfLines={2}
          style={[styles.cardTitle, { color: theme.textPrimary }]}
        >
          {item.name}
        </Text>
      </View>
    </Pressable>
  );
});

const TagNovelsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, "TagNovels">>();
  const { id, name } = route.params;
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useTagNovels(id);

  const items = data?.items ?? [];

  const renderItem = useCallback(
    ({ item }: { item: TaggedNovel }) => <TagNovelCard item={item} />,
    [],
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Screen>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.72}
          style={[
            styles.backButton,
            {
              backgroundColor: isDarkMode ? theme.surface : "#F8FAFC",
              borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB",
            },
          ]}
        >
          <BackArrowIcon size={18} color={theme.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={[styles.eyebrow, { color: theme.textSecondary }]}>
            Etiket
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: theme.textPrimary }]}
          >
            #{name}
          </Text>
        </View>
      </View>

      <View style={styles.resultHeader}>
        <Text style={[styles.resultLabel, { color: theme.textSecondary }]}>
          {data?.total ? `${data.total} roman` : "Romanlar"}
        </Text>
      </View>

      <FlatList
        data={items}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={styles.columnWrapper}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.45}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={theme.accent}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.accent} />
            ) : (
              <>
                <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                  {isError ? "Liste alinamadi" : "Roman bulunamadi"}
                </Text>
                <Text
                  style={[styles.emptySubtitle, { color: theme.textSecondary }]}
                >
                  #{name}
                </Text>
              </>
            )}
          </View>
        }
      />
    </Screen>
  );
};

export default TagNovelsScreen;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontFamily: "Mont-600",
    fontSize: 8,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  title: {
    fontFamily: "Mont-600",
    fontSize: 16,
    lineHeight: 26,
  },
  resultHeader: {
    height: 42,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  resultLabel: {
    fontFamily: "Mont-700",
    fontSize: 10,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 4,
    paddingBottom: 96,
  },
  columnWrapper: {
    gap: CARD_GAP,
  },
  card: {
    width: CARD_WIDTH,
    marginBottom: 20,
  },
  cardPressed: {
    opacity: 0.82,
  },
  coverWrap: {
    width: "100%",
    aspectRatio: 2 / 3,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  coverFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  coverFallbackText: {
    fontFamily: "Mont-700",
    fontSize: 22,
    opacity: 0.45,
  },
  cardBody: {
    paddingTop: 8,
  },
  cardTitle: {
    fontFamily: "Mont-600",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingBottom: 72,
  },
  emptyTitle: {
    fontFamily: "Mont-700",
    fontSize: 15,
    marginTop: 12,
    marginBottom: 5,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 18,
  },
});
