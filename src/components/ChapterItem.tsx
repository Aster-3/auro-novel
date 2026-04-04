import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { LockIcon } from "./icons/LockIcon";
import { DownloadIcon } from "./icons/DownloadIcon";
import { Chapter } from "@/types/chapter";
import { Fragment } from "react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

interface ChapterItemProps {
  chapter: Chapter;
  index: number;
  showVolumeHeader: boolean; // Yeni ekledik
}

export const ChapterItem = ({
  chapter,
  index,
  showVolumeHeader,
}: ChapterItemProps) => {
  const volumeLabel = `Cilt: ${chapter.volumeOrder}${
    chapter.volumeName ? ` - ${chapter.volumeName}` : ""
  }`;

  const navigation = useAppNavigation();

  const handlePress = () => {
    navigation.navigate("NovelRead", {
      id: chapter.id,
    });
  };

  return (
    <Fragment>
      {showVolumeHeader && (
        <View style={styles.minimalVolumeContainer}>
          <Text style={styles.volumeText}>{volumeLabel}</Text>
          <View style={styles.line} />
        </View>
      )}

      {/* Bölüm Satırı */}
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.chapterPressable,
          pressed && styles.pressedState,
        ]}
      >
        <View style={styles.leftContent}>
          <Text style={styles.indexText}>
            {String(index + 1).padStart(2, "0")} -
          </Text>
          <Text numberOfLines={1} style={styles.chapterTitle}>
            {chapter.title}
          </Text>
        </View>

        <View style={styles.rightContent}>
          {chapter.isLocked ? (
            <View style={styles.iconWrapper}>
              <LockIcon size={16} />
            </View>
          ) : (
            <TouchableOpacity activeOpacity={0.7} style={styles.downloadButton}>
              <DownloadIcon size={16} color="#0f3f92" />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  volumeContainer: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 4,
    borderLeftColor: "#0f3f92",
    marginTop: 8,
    justifyContent: "center",
  },
  volumeText: {
    fontFamily: "Mont-700",
    fontSize: 8,
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  minimalVolumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  chapterPressable: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pressedState: {
    backgroundColor: "#f2f2f3",
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
    color: "#9CA3AF",
  },
  chapterTitle: {
    fontFamily: "Mont-600",
    fontSize: 13,
    color: "#1F2937",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    padding: 10,
  },
  downloadButton: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
