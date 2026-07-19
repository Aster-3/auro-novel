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
import { AllDownloadedIcon } from "@/components/icons/AllDownloadedIcon";
import { ChapterReverseIcon } from "@/components/icons/ChapterReverseIcon";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { useInfiniteChapters } from "@/hooks/useInfiniteChapters";
import { Chapter } from "@/types/chapter";
import { SortType } from "@/types/constants";
import { globalNavigate } from "@/navigation/globalNavigate";
import { OfflineChapterDownloadControls } from "@/hooks/useOfflineChapterDownloads";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı çektik

export const ChapterSheet = forwardRef(
  (
    props: {
      id: string;
      offlineDownloads?: OfflineChapterDownloadControls;
    },
    ref,
  ) => {
    const [sortType, setSortType] = useState<SortType>(SortType.ASC);
    const { id, offlineDownloads } = props;
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
          onDownload={
            offlineDownloads?.canUseOfflineDownloads
              ? () => offlineDownloads.downloadChapter(item.id)
              : undefined
          }
          downloadStatus={
            offlineDownloads?.downloadingChapterIds.includes(item.id)
              ? "downloading"
              : offlineDownloads?.downloadedIds.has(item.id)
                ? "downloaded"
                : "idle"
          }
        />
      );
    };

    const hasMissingChapters = !!offlineDownloads?.missingChapterIds.length;
    const isManifestLoading = !!offlineDownloads?.isManifestLoading;
    const canUseOfflineDownloads =
      offlineDownloads?.canUseOfflineDownloads ?? false;
    const isDownloadAllDisabled =
      !canUseOfflineDownloads ||
      isManifestLoading ||
      !hasMissingChapters ||
      !!offlineDownloads?.isDownloadingAll;
    const titleText = offlineDownloads?.isDownloadingAll
      ? `${offlineDownloads.downloadProgress.completed} / ${offlineDownloads.downloadProgress.total} indiriliyor`
      : `${data?.total || 0} Bölüm`;

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
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => offlineDownloads?.downloadAll()}
            disabled={isDownloadAllDisabled}
            style={[
              styles.headerIconButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(0,0,0,0.025)",
                opacity: isDownloadAllDisabled ? 0.45 : 1,
              },
            ]}
          >
            <View style={styles.downloadAllIconWrap}>
              <AllDownloadedIcon color={theme.textPrimary} size={18} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            {titleText}
          </Text>
          <TouchableOpacity
            onPress={() =>
              setSortType(
                sortType === SortType.ASC ? SortType.DESC : SortType.ASC,
              )
            }
            style={{
              width: 36,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
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
  },
);

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
  headerIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  downloadAllIconWrap: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  downloadAllBadge: {
    position: "absolute",
    right: -4,
    top: -4,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
};
