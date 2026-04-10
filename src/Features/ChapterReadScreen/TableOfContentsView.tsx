import { ChapterItem } from "@/components/ChapterItem";
import { useInfiniteChapters } from "@/hooks/useInfiniteChapters";
import { Chapter } from "@/types/chapter";
import { SortType } from "@/types/constants";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMemo, useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";

export const TableOfContentsView = ({
  id,
  selectChapter,
  closeSheet,
}: {
  id: string;
  selectChapter: (id: string) => void;
  closeSheet: () => void;
}) => {
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteChapters({ id: id, sort: SortType.ASC });

  const chapters = useMemo(() => {
    return data?.items || [];
  }, [data]);

  const renderItem = ({ item, index }: { item: Chapter; index: number }) => {
    const previousItem = chapters[index - 1];

    const showVolumeHeader =
      !previousItem || previousItem.volumeOrder !== item.volumeOrder;

    return (
      <ChapterItem
        index={index}
        chapter={item}
        showVolumeHeader={showVolumeHeader}
        onNavigate={() => {
          closeSheet();
          setTimeout(() => {
            selectChapter(item.id);
          }, 200);
        }}
      />
    );
  };

  return (
    <BottomSheetFlatList
      data={chapters}
      keyExtractor={(item: Chapter) => item.id}
      renderItem={renderItem}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <ActivityIndicator style={{ marginVertical: 20 }} color="#03061E" />
        ) : (
          <View style={{ height: 40 }} />
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
});
