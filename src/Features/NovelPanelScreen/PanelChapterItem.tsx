import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Chapter, DraftChapter } from "@/types/chapter";
import { formatRawDate } from "@/utils/formatRawDate";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { ChapterItemMoreOptions } from "./ChapterItemMoreOptions";
import { DownChevronIcon } from "@/components/icons/DownChevronIcon";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

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
      duration: 250,
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
      novelId: novelId,
    });
  };

  const renderVolumeHeader = () => {
    if (isPublished && "volumeOrder" in chapter) {
      const volChapter = chapter as Chapter;
      const volumeLabel = `Cilt: ${volChapter.volumeOrder}${
        volChapter.volumeName ? ` - ${volChapter.volumeName}` : ""
      }`;

      return (
        <View style={styles.minimalVolumeContainer}>
          <Text style={[styles.volumeText, { color: theme.textSecondary }]}>
            {volumeLabel}
          </Text>
          <View
            style={[
              styles.line,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.05)"
                  : "#E5E7EB",
              },
            ]}
          />
        </View>
      );
    }
    return null;
  };

  const orderPrefix =
    isPublished && "chapterOrder" in chapter
      ? `${String((chapter as Chapter).chapterOrder).padStart(2, "0")} - `
      : "";

  const isUnpublishedChapter =
    "isUnpublished" in chapter ? chapter.isUnpublished : false;

  return (
    <View style={styles.container}>
      {showVolumeHeader && renderVolumeHeader()}

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.chapterPressable,
          isUnpublishedChapter && styles.unpublishedBackground,
          {
            backgroundColor: pressed
              ? isDarkMode
                ? "rgba(255,255,255,0.05)"
                : "#eeeef0"
              : "transparent",
          },
        ]}
      >
        <View style={styles.leftContent}>
          {orderPrefix ? (
            <Text
              style={[
                styles.indexText,
                { color: theme.textSecondary },
                isUnpublishedChapter && styles.fadedText,
              ]}
            >
              {orderPrefix}
            </Text>
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

            <View style={styles.dateAndBadgeRow}>
              <Text style={[styles.dateText, { color: theme.textSecondary }]}>
                {isPublished && "publishedAt" in chapter
                  ? formatRawDate(chapter.publishedAt, true)
                  : "createdAt" in chapter
                    ? formatRawDate(chapter.createdAt, true)
                    : ""}
              </Text>

              {isUnpublishedChapter && (
                <View
                  style={[
                    styles.unpublishedBadge,
                    {
                      backgroundColor: isDarkMode
                        ? "rgba(239, 68, 68, 0.15)"
                        : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[styles.unpublishedBadgeText, { color: "#EF4444" }]}
                  >
                    Yayından Kaldırıldı
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <Pressable
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
          onPress={() => setShowMoreOptions((prev) => !prev)}
        >
          <View
            style={[
              styles.morebutton,
              {
                backgroundColor: isDarkMode
                  ? "rgba(255,255,255,0.08)"
                  : "#ededed",
              },
              isUnpublishedChapter && styles.unpublishedMoreButton,
            ]}
          >
            <Animated.View
              style={{
                transform: [{ rotate: spin }],
              }}
            >
              <DownChevronIcon size={18} color={theme.textPrimary} />
            </Animated.View>
          </View>
        </Pressable>
      </Pressable>

      {showMoreOptions && (
        <ChapterItemMoreOptions
          chapterId={chapter.id}
          isPublished={isPublished}
          novelId={novelId}
          isArchived={isUnpublishedChapter}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  minimalVolumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    gap: 12,
  },
  volumeText: {
    fontFamily: "Mont-700",
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  line: {
    flex: 1,
    height: 1,
  },
  chapterPressable: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  indexText: {
    fontFamily: "Mont-400",
    fontSize: 12,
  },
  infoSection: {
    flex: 1,
  },
  chapterTitle: {
    fontFamily: "Mont-600",
    fontSize: 13,
  },
  dateAndBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 8,
  },
  dateText: {
    fontFamily: "Mont-400",
    fontSize: 10,
  },
  morebutton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  unpublishedBackground: {
    opacity: 0.6,
  },
  fadedText: {
    textDecorationLine: "line-through",
  },
  unpublishedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unpublishedBadgeText: {
    fontFamily: "Mont-600",
    fontSize: 8,
    textTransform: "uppercase",
  },
  unpublishedMoreButton: {
    opacity: 0.5,
  },
});
