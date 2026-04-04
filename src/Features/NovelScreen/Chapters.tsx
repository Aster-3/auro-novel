import { Text, View, StyleSheet, Pressable } from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

interface NovelChaptersProps {
  id: string;
  openChapterSheet: () => void;
  chapterCount: number;
  lastChapterDate: string;
}

export const NovelChapters = ({
  openChapterSheet,
  chapterCount,
  lastChapterDate,
}: NovelChaptersProps) => {
  const updateStatusText = lastChapterDate
    ? `En Son Güncelleme: ${formatRelativeTime(lastChapterDate)}`
    : "Henüz Bölüm yayınlanmadı";

  return (
    <Pressable
      onPress={openChapterSheet}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.leftContent}>
        <Text style={styles.chapterText}>Bölümler</Text>
        <Text style={styles.updateText}>{updateStatusText}</Text>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.chapterCount}>{chapterCount} Bölüm</Text>
        <RightChevronIcon color="#2A2929" size={24} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  leftContent: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  dotSeparator: {
    padding: 1.5,
    backgroundColor: "#3b3e42",
    borderRadius: 99,
  },
  chapterText: {
    fontFamily: "Mont-700",
    fontSize: 15,
    color: "#03061ed3",
    letterSpacing: -0.2,
  },
  rightContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  chapterCount: {
    fontFamily: "Mont-600",
    fontSize: 14,
    color: "#03061ed3",
  },
  updateText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#5C5C5C",
    letterSpacing: -0.5,
  },
  statusText: {
    fontFamily: "Mont-500",
    fontSize: 14,
    color: "#5C5C5C",
    paddingVertical: 12,
    textAlign: "center",
  },
});
