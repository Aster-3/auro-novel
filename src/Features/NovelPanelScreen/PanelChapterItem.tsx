import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { Chapter, DraftChapter } from "@/types/chapter";
import { formatRawDate } from "@/utils/formatRawDate";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { ChapterItemMoreOptions } from "./ChapterItemMoreOptions";

type PanelChapterItemProps = {
  chapter: Chapter | DraftChapter;
  isPublished: boolean;
  showVolumeHeader: boolean;
  novelId: string;
};

export const PanelChapterItem = ({
  chapter,
  showVolumeHeader,
  novelId,
  isPublished,
}: PanelChapterItemProps) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: showMoreOptions ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showMoreOptions, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const handlePress = () => {
    navigation.navigate("ChapterEdit", {
      isChapterAvailable: true,
      chapterId: chapter.id,
      isDraft: !isPublished,
      novelId,
    });
  };

  const isUnpublishedChapter =
    "isUnpublished" in chapter ? chapter.isUnpublished : false;

  const chapterOrder =
    isPublished && "chapterOrder" in chapter
      ? String((chapter as Chapter).chapterOrder).padStart(2, "0")
      : null;

  const dateLabel =
    isPublished && "publishedAt" in chapter
      ? formatRawDate(chapter.publishedAt, true)
      : "createdAt" in chapter
        ? formatRawDate(chapter.createdAt, true)
        : "";

  const renderVolumeHeader = () => {
    if (!isPublished || !("volumeOrder" in chapter)) {
      return null;
    }

    const volChapter = chapter as Chapter;
    const volumeLabel = `Cilt ${volChapter.volumeOrder}${
      volChapter.volumeName ? ` · ${volChapter.volumeName}` : ""
    }`;

    return (
      <View style={styles.volumeContainer}>
        <Text
          style={[
            styles.volumeText,
            { color: isDarkMode ? "rgba(255,255,255,0.58)" : "#64748B" },
          ]}
        >
          {volumeLabel}
        </Text>
        <View
          style={[
            styles.volumeLine,
            {
              backgroundColor: isDarkMode
                ? "rgba(255,255,255,0.035)"
                : "rgba(15,23,42,0.045)",
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showVolumeHeader && renderVolumeHeader()}

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.chapterPressable,
          {
            backgroundColor: pressed
              ? isDarkMode
                ? "rgba(255,255,255,0.045)"
                : "rgba(15,23,42,0.035)"
              : "transparent",
            borderBottomColor: isDarkMode
              ? "rgba(255,255,255,0.035)"
              : "rgba(15,23,42,0.045)",
          },
          isUnpublishedChapter && styles.archivedRow,
        ]}
      >
        <View style={styles.leftContent}>
          {chapterOrder ? (
            <View
              style={[
                styles.orderBadge,
                {
                  backgroundColor: "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.orderText,
                  { color: theme.textPrimary },
                ]}
              >
                {chapterOrder}
              </Text>
            </View>
          ) : null}

          <View style={styles.infoSection}>
            <Text
              numberOfLines={1}
              style={[
                styles.chapterTitle,
                { color: theme.textPrimary },
                isUnpublishedChapter && styles.fadedText,
              ]}
            >
              {chapter.title}
            </Text>

            <View style={styles.metaRow}>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                {dateLabel}
              </Text>

              {isUnpublishedChapter ? (
                <View
                  style={[
                    styles.unpublishedBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(248,113,113,0.12)"
                        : "rgba(239,68,68,0.09)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.unpublishedBadgeText,
                      { color: isDarkMode ? "#FCA5A5" : "#DC2626" },
                    ]}
                  >
                    Yayından kaldırıldı
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        <Pressable
          hitSlop={8}
          style={styles.morePressable}
          onPress={(event) => {
            event.stopPropagation();
            setShowMoreOptions((prev) => !prev);
          }}
        >
          <View
            style={[
              styles.moreButton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.045)"
                  : "rgba(15,23,42,0.035)",
              },
              isUnpublishedChapter && styles.unpublishedMoreButton,
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <DownChevronIcon size={17} color={theme.textPrimary} />
            </Animated.View>
          </View>
        </Pressable>
      </Pressable>

      {showMoreOptions ? (
        <ChapterItemMoreOptions
          chapterId={chapter.id}
          isPublished={isPublished}
          novelId={novelId}
          isArchived={isUnpublishedChapter}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  volumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 4,
    gap: 10,
  },
  volumeText: {
    fontFamily: "Mont-500",
    fontSize: 8.5,
    textTransform: "uppercase",
  },
  volumeLine: {
    flex: 1,
    height: 1,
  },
  chapterPressable: {
    minHeight: 58,
    paddingHorizontal: 4,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
    minWidth: 0,
  },
  orderBadge: {
    width: 26,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  orderText: {
    fontFamily: "Mont-500",
    fontSize: 10.5,
  },
  infoSection: {
    flex: 1,
    minWidth: 0,
  },
  chapterTitle: {
    fontFamily: "Mont-500",
    fontSize: 13,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  dateText: {
    fontFamily: "Mont-400",
    fontSize: 10,
  },
  morePressable: {
    paddingLeft: 10,
    paddingVertical: 4,
  },
  moreButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  archivedRow: {
    opacity: 0.72,
  },
  fadedText: {
    textDecorationLine: "line-through",
  },
  unpublishedBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 7,
  },
  unpublishedBadgeText: {
    fontFamily: "Mont-500",
    fontSize: 8,
  },
  unpublishedMoreButton: {
    opacity: 0.65,
  },
});
