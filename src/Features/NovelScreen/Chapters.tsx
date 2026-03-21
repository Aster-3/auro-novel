import { Text, View, StyleSheet, Pressable } from "react-native";
import { RightChevronIcon } from "@/components/icons/RightChevronIcon";
import { useChapterSummary } from "@/hooks/useChapterSummary";
import { formatRelativeTime } from "@/utils/formatRelativeTime";

export const NovelChapters = ({
  id,
  openChapterSheet,
}: {
  id: string;
  openChapterSheet: () => void;
}) => {
  const { data, error, isLoading } = useChapterSummary(id);
  if (isLoading) {
    return <Text>Yükleniyor...</Text>;
  }
  if (error) {
    return <Text>Hata: {error.message}</Text>;
  }
  if (!data) {
    return <Text>Veri bulunamadı.</Text>;
  }
  return (
    <Pressable
      onPress={openChapterSheet}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={styles.chapterText}>Bölümler: {data.total}</Text>

      <View style={styles.rightContent}>
        <Text style={styles.updateText}>
          {data.lastPublishedAt
            ? `En Son Güncelleme: ${formatRelativeTime(data.lastPublishedAt)}`
            : "Henüz bölüm yayınlanmadı"}
        </Text>
        <RightChevronIcon color="#2A2929" size={16} />
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
  chapterText: {
    fontFamily: "Mont-700",
    fontSize: 15,
    letterSpacing: -0.2,
    color: "#03061ed3",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  updateText: {
    fontFamily: "Mont-500",
    fontSize: 12,
    color: "#5C5C5C",
    letterSpacing: -0.5,
  },
});
