import { Text, View, StyleSheet, Pressable } from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { useReaderStore } from "@/store/useReaderStore";
import { useAppTheme } from "@/hooks/useTheme";

interface NovelChaptersProps {
  id: string;
  openChapterSheet: () => void;
  chapterCount: number;
  lastChapterDate: string | null;
}

export const NovelChapters = ({
  openChapterSheet,
  chapterCount,
  lastChapterDate,
}: NovelChaptersProps) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  const { theme } = useAppTheme();

  // 0 Bölüm olsa bile tarih yoksa standart metin döner
  const updateStatusText = lastChapterDate
    ? `Son güncelleme: ${formatRelativeTime(lastChapterDate)}`
    : "Henüz bölüm yayınlanmadı";

  return (
    <Pressable
      onPress={openChapterSheet}
      // Arka plan rengini (backgroundColor) tamamen kaldırdık.
      // Dokunma hissini sadece hafif bir opacity düşüşüyle (0.6) veriyoruz.
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <View style={styles.leftContent}>
        <Text style={[styles.chapterText, { color: theme.textPrimary }]}>
          Bölümler
        </Text>
        <Text style={[styles.updateText, { color: theme.textSecondary }]}>
          {updateStatusText}
        </Text>
      </View>

      <View style={styles.rightContent}>
        {/* chapterCount 0 olsa bile aynı stil ile render edilir */}
        <Text style={[styles.chapterCount, { color: theme.textSecondary }]}>
          {chapterCount || 0} Bölüm
        </Text>
        <View style={styles.chevronWrapper}>
          <RightChevronIcon color={theme.textSecondary} size={16} />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  leftContent: {
    gap: 4,
  },
  chapterText: {
    fontFamily: "Mont-700",
    fontSize: 16,
    letterSpacing: -0.5, // Kalın fontta harf arasını daraltmak şık durur
  },
  updateText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    letterSpacing: -0.1,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  chapterCount: {
    fontFamily: "Mont-500",
    fontSize: 13,
    letterSpacing: -0.2,
  },
  chevronWrapper: {
    opacity: 0.7,
    marginTop: 1,
  },
});
