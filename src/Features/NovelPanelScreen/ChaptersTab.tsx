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

export const ChaptersTab = ({ route }: { route: any }) => {
  const { novelId, isPublished } = route.params;
  const [sortType, setSortType] = useState<SortType>(SortType.ASC);

  // 1. HOOK TANIMLAMALARI (Mutlaka en üstte ve her zaman aynı sırada olmalı)
  const publishedQuery = useInfiniteChapters(
    { id: novelId, sort: sortType },
    isPublished === true,
  );

  const draftQuery = useInfiniteDraftChapters(
    { id: novelId },
    isPublished === false,
  );

  // Aktif query'yi seçiyoruz (Hook değil, sadece referans)
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
    if (!activeQuery.isFetchingNextPage)
      return <View style={styles.footerSpacer} />;
    return (
      <ActivityIndicator style={styles.loader} color="#03061E" size="small" />
    );
  }, [activeQuery.isFetchingNextPage]);

  // 2. KONTROL VE ERKEN RETURN (Tüm Hook'lardan SONRA yapılmalı)

  // Hata Durumu
  if (activeQuery.error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{activeQuery.error.message}</Text>
      </View>
    );
  }

  // İlk Yükleme Durumu
  if (activeQuery.isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#03061E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text>
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
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loader: {
    marginVertical: 20,
  },
  footerSpacer: {
    height: 40,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
});
