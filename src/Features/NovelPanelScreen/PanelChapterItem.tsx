import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Chapter, DraftChapter } from "@/types/chapter";
import { formatRawDate } from "@/utils/formatRawDate";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { useState, useRef, useEffect } from "react";
import { ChapterItemMoreOptions } from "./ChapterItemMoreOptions";
import { DownChevronIcon } from "@/components/icons/DownChevronIcon";

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
  const navigation = useAppNavigation();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Animasyon için başlangıç değeri (0)
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // showMoreOptions değiştiğinde animasyonu tetikle
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
          <Text style={styles.volumeText}>{volumeLabel}</Text>
          <View style={styles.line} />
        </View>
      );
    }
    return null;
  };

  const orderPrefix =
    isPublished && "chapterOrder" in chapter
      ? `${String((chapter as Chapter).chapterOrder).padStart(2, "0")} - `
      : "";

  // TypeScript tip kontrolü: isUnpublished sadece Chapter tipinde olabilir.
  // DraftChapter geldiğinde hata vermemesi için "in" operatörüyle güvenli kontrol yapıyoruz.
  const isUnpublishedChapter =
    "isUnpublished" in chapter ? chapter.isUnpublished : false;

  return (
    <View style={styles.container}>
      {showVolumeHeader && renderVolumeHeader()}

      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [
          styles.chapterPressable,
          isUnpublishedChapter && styles.unpublishedBackground, // Yayından kaldırıldıysa arkaplanı değiştir
          pressed && styles.pressedState,
        ]}
      >
        <View style={styles.leftContent}>
          {orderPrefix ? (
            <Text
              style={[
                styles.indexText,
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
                isUnpublishedChapter && styles.fadedText,
              ]}
            >
              {chapter.title}
            </Text>

            <View style={styles.dateAndBadgeRow}>
              <Text style={styles.dateText}>
                {isPublished && "publishedAt" in chapter
                  ? formatRawDate(chapter.publishedAt, true)
                  : "createdAt" in chapter
                    ? formatRawDate(chapter.createdAt, true)
                    : ""}
              </Text>

              {/* Yayından Kaldırıldı Rozeti */}
              {isUnpublishedChapter && (
                <View style={styles.unpublishedBadge}>
                  <Text style={styles.unpublishedBadgeText}>
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
              isUnpublishedChapter && styles.unpublishedMoreButton,
            ]}
          >
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <DownChevronIcon
                size={18}
                color={isUnpublishedChapter ? "#9CA3AF" : "#262a30"}
              />
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
    color: "#4B5563",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  chapterPressable: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
  },
  pressedState: {
    backgroundColor: "#eeeef0",
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
  infoSection: {
    flex: 1,
  },
  chapterTitle: {
    fontFamily: "Mont-600",
    fontSize: 13,
    color: "#1F2937",
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
    color: "#8b96a5",
  },
  rightContent: {
    paddingLeft: 10,
  },
  morebutton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ededed",
  },

  // --- EKLENEN YENİ STİLLER ---
  unpublishedBackground: {
    opacity: 0.85, // Tüm elementi hafif soluk yapar
  },
  fadedText: {
    color: "#9CA3AF", // Metinleri grileştirir
    textDecorationLine: "line-through", // İstersen üstünü çizebilirsin, istemezsen bu satırı silebilirsin
  },
  unpublishedBadge: {
    backgroundColor: "#FEE2E2", // Açık kırmızımsı arka plan
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unpublishedBadgeText: {
    fontFamily: "Mont-600",
    fontSize: 8,
    color: "#EF4444", // Belirgin kırmızı uyarı metni
    textTransform: "uppercase",
  },
  unpublishedMoreButton: {
    backgroundColor: "#F3F4F6", // Butonu da hafif soldurmak için
  },
});
