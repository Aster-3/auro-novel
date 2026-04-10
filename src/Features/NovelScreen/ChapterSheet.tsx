import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { ChapterItem } from "@/components/ChapterItem";
import { ChapterReverseIcon } from "@/components/icons/ChapterReverseIcon";
import { useInfiniteChapters } from "@/hooks/useInfiniteChapters";
import { Chapter } from "@/types/chapter";
import { SortType } from "@/types/constants";
import { globalNavigate } from "@/navigation/globalNavigate";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı çektik

export const ChapterSheet = forwardRef((props: { id: string }, ref) => {
  const [sortType, setSortType] = useState<SortType>(SortType.ASC);
  const { id } = props;
  const { theme, isDarkMode } = useAppTheme(); // Renkleri aldık

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, isLoading } =
    useInfiniteChapters({ id, sort: sortType });

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const chapters = useMemo(() => {
    return data?.items || [];
  }, [data]);

  useImperativeHandle(ref, () => ({
    expand: () => {
      bottomSheetRef.current?.snapToIndex(0);
    },
  }));

  const renderItem = ({ item, index }: { item: Chapter; index: number }) => {
    const previousItem = chapters[index - 1];
    const showVolumeHeader =
      !previousItem || previousItem.volumeOrder !== item.volumeOrder;

    return (
      <ChapterItem
        key={item.id}
        index={index}
        chapter={item}
        showVolumeHeader={showVolumeHeader}
        onNavigate={() => {
          globalNavigate("ChapterRead", { id: item.id });
          setTimeout(() => {
            bottomSheetRef.current?.close();
          }, 200);
        }}
      />
    );
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      backgroundStyle={{
        borderRadius: 26,
        backgroundColor: theme.background, // Dinamik arka plan
      }}
      handleIndicatorStyle={{
        backgroundColor: isDarkMode
          ? "rgba(255,255,255,0.15)"
          : "rgba(0,0,0,0.1)", // Sürükleme çubuğu
      }}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      enableDynamicSizing={false}
    >
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {data?.total || 0} Bölüm
        </Text>
        <TouchableOpacity
          onPress={() =>
            setSortType(
              sortType === SortType.ASC ? SortType.DESC : SortType.ASC,
            )
          }
          style={{
            transform: [
              { rotate: sortType === SortType.ASC ? "0deg" : "180deg" },
            ],
          }}
        >
          <ChapterReverseIcon color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : (
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
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                color={theme.accent}
              />
            ) : (
              <View style={{ height: 40 }} />
            )
          }
        />
      )}
    </BottomSheet>
  );
});

const styles = {
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  } as ViewStyle,
  title: {
    fontFamily: "Mont-600",
    fontSize: 15,
  } as TextStyle,
};
