import React, { useMemo, useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useInfiniteChapters } from "@/hooks/useInfiniteChapters";
import { PanelChapterItem } from "./PanelChapterItem";
import { Chapter, DraftChapter } from "@/types/chapter";
import { SortType } from "@/types/constants";
import { useInfiniteDraftChapters } from "@/hooks/useInfiniteDraftChapters";
import { useAppTheme } from "@/hooks/useTheme";

export const ChaptersTab = ({ route }: { route: any }) => {
  const { theme } = useAppTheme();
  const { novelId, isPublished } = route.params;
  const [sortType] = useState<SortType>(SortType.ASC);

  const publishedQuery = useInfiniteChapters(
    { id: novelId, sort: sortType },
    isPublished === true,
  );

  const draftQuery = useInfiniteDraftChapters(
    { id: novelId },
    isPublished === false,
  );

  const activeQuery = isPublished ? publishedQuery : draftQuery;

  const chapters = useMemo(() => {
    return activeQuery.data?.items || [];
  }, [activeQuery.data]);

  const renderItem = useCallback(
    ({ item, index }: { item: Chapter | DraftChapter; index: number }) => {
      let showHeader = false;

      if (isPublished) {
        const currentChapter = item as Chapter;
        const prevChapter = chapters[index - 1] as Chapter | undefined;

        showHeader =
          index === 0 ||
          prevChapter?.volumeOrder !== currentChapter.volumeOrder;
      }

      return (
        <PanelChapterItem
          chapter={item}
          showVolumeHeader={showHeader}
          novelId={novelId}
          isPublished={isPublished}
        />
      );
    },
    [chapters, novelId, isPublished],
  );

  const handleLoadMore = useCallback(() => {
    if (activeQuery.hasNextPage && !activeQuery.isFetchingNextPage) {
      activeQuery.fetchNextPage();
    }
  }, [
    activeQuery.hasNextPage,
    activeQuery.isFetchingNextPage,
    activeQuery.fetchNextPage,
  ]);

  const ListFooter = useCallback(() => {
    if (!activeQuery.isFetchingNextPage) {
      return <View style={styles.footerSpacer} />;
    }

    return (
      <View style={styles.loader}>
        <ActivityIndicator color={theme.accent} size="small" />
      </View>
    );
  }, [activeQuery.isFetchingNextPage, theme.accent]);

  if (activeQuery.error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: "#ef4444" } as any]}>
          {activeQuery.error.message}
        </Text>
      </View>
    );
  }

  if (activeQuery.isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          chapters.length === 0 && styles.emptyListContent,
        ]}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {isPublished
                ? "Henüz yayınlanmış bölüm bulunmuyor."
                : "Henüz taslak bölüm bulunmuyor."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 44,
    gap: 2,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerSpacer: {
    height: 28,
  },
  errorText: {
    textAlign: "center",
    fontFamily: "Mont-600",
  },
  emptyState: {
    marginHorizontal: 4,
    paddingHorizontal: 18,
    paddingVertical: 22,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
  },
});
