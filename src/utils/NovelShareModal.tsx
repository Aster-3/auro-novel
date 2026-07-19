import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  Pressable,
} from "react-native";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { Image } from "expo-image";
import { useAppTheme } from "@/hooks/useTheme";
import { ShareIcon } from "@/components/icons/ShareIcon";
import { Category } from "@/types/category";
import { Novel, SeriesStatus } from "@/types/novel";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Props {
  isVisible: boolean;
  onClose: () => void;
  novel: Novel;
}

const statusLabels: Record<SeriesStatus, string> = {
  [SeriesStatus.ONGOING]: "Devam Ediyor",
  [SeriesStatus.COMPLETED]: "Tamamlandı",
  [SeriesStatus.HIATUS]: "Ara Verildi",
  [SeriesStatus.CANCELLED]: "Durduruldu",
  [SeriesStatus.DRAFT]: "Hazırlıkta",
};

const statusColors: Record<SeriesStatus, string> = {
  [SeriesStatus.ONGOING]: "#03e889",
  [SeriesStatus.COMPLETED]: "#36e8ff",
  [SeriesStatus.HIATUS]: "#c2f493",
  [SeriesStatus.CANCELLED]: "#FF3D00",
  [SeriesStatus.DRAFT]: "#FFD600",
};

const getCategoryTitle = (category: Category | string) =>
  typeof category === "string" ? category : category.title;

const NovelShareModal: React.FC<Props> = ({
  isVisible,
  onClose,
  novel,
}) => {
  const viewShotRef = useRef<ViewShot>(null);
  const { theme, isDarkMode } = useAppTheme();
  const title = novel.name;
  const author = novel.author.authorName || "Bilinmeyen Yazar";
  const cover = novel.coverImage;
  const synopsis =
    novel.synopsis || "Yazar tarafından henüz bir özet girilmedi...";
  const categories = novel.categories ?? [];
  const status = statusLabels[novel.status] ?? "Bilinmeyen Durum";
  const statusColor = statusColors[novel.status] ?? "#10B981";

  // Animasyon Değerleri
  const shareScale = useSharedValue(1);
  const closeScale = useSharedValue(1);

  const animatedShareStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareScale.value }],
  }));

  const animatedCloseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  const handleShare = async () => {
    try {
      if (viewShotRef.current?.capture) {
        const uri = await viewShotRef.current.capture();
        await Sharing.shareAsync(uri, {
          dialogTitle: title,
          mimeType: "image/png",
        });
      }
    } catch (error) {
      console.error("Paylaşım hatası:", error);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View style={s.content}>
          <ViewShot
            ref={viewShotRef}
            options={{ format: "png", quality: 1.0 }}
            style={[
              s.cardContainer,
              { backgroundColor: isDarkMode ? "#0c0c11" : "#FFF" },
            ]}
          >
            <View style={s.cardContent}>
              <View style={s.infoArea}>
                <View style={s.statusRow}>
                  <View style={[s.statusDot, { backgroundColor: statusColor }]} />
                  <Text style={[s.statusText, { color: statusColor }]}>
                    {status}
                  </Text>
                </View>

                <Text
                  style={[s.title, { color: theme.textPrimary }]}
                  numberOfLines={3}
                >
                  {title}
                </Text>

                <Text style={[s.author, { color: theme.textSecondary }]}>
                  {author}
                </Text>

                {categories.length > 0 && (
                  <View style={s.categoryRow}>
                    {categories.slice(0, 3).map((cat, i) => (
                      <React.Fragment key={cat.id}>
                        <Text
                          style={[
                            s.categoryText,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {getCategoryTitle(cat)}
                        </Text>
                        {i < categories.slice(0, 3).length - 1 && (
                          <View
                            style={[
                              s.dotSeparator,
                              {
                                backgroundColor: isDarkMode
                                  ? "rgba(255,255,255,0.2)"
                                  : "rgba(0,0,0,0.1)",
                              },
                            ]}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                )}

                <Text
                  style={[s.synopsis, { color: theme.textSecondary }]}
                  numberOfLines={5}
                >
                  {synopsis}
                </Text>

                <Text style={[s.brandText, { color: theme.textSecondary }]}>
                  AURO NOVEL
                </Text>
              </View>

              <View style={s.coverWrapper}>
                {cover ? (
                  <Image
                    source={{ uri: cover }}
                    style={s.mainCover}
                    contentFit="cover"
                  />
                ) : (
                  <View style={[s.mainCover, s.coverPlaceholder]} />
                )}
              </View>
            </View>
          </ViewShot>

          <View style={s.actionArea}>
            <Animated.View style={animatedShareStyle}>
              <Pressable
                style={[
                  s.shareBtn,
                  { backgroundColor: isDarkMode ? "#111111" : "#ffffff" },
                ]}
                onPress={handleShare}
                onPressIn={() => (shareScale.value = withSpring(0.97))}
                onPressOut={() => (shareScale.value = withSpring(1))}
              >
                <Text
                  style={[
                    s.shareBtnText,
                    { color: isDarkMode ? "#FFF" : "#000" },
                  ]}
                >
                  PAYLAŞ
                </Text>
                <ShareIcon
                  size={18}
                  strokeWidth={0.7}
                  color={isDarkMode ? "#FFF" : "#000"}
                />
              </Pressable>
            </Animated.View>

            <Animated.View style={animatedCloseStyle}>
              <Pressable
                style={s.closeBtn}
                onPress={onClose}
                onPressIn={() => (closeScale.value = withSpring(0.95))}
                onPressOut={() => (closeScale.value = withSpring(1))}
              >
                <Text style={[s.closeBtnText]}>Vazgeç</Text>
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
  },
  cardContainer: {
    width: SCREEN_WIDTH - 24,
    borderRadius: 24,
    padding: 24,
  },
  cardContent: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-start",
  },
  infoArea: {
    flex: 1,
    paddingRight: 12,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 8,
    color: "#10B981",
    fontFamily: "Mont-600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 19,
    fontFamily: "Mont-700",
    lineHeight: 23,
    letterSpacing: -0.6,
  },
  author: {
    fontSize: 11,
    fontFamily: "Mont-500",
    marginTop: 4,
    opacity: 0.6,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    flexWrap: "wrap",
  },
  categoryText: {
    fontSize: 9,
    fontFamily: "Mont-600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    opacity: 0.5,
  },
  dotSeparator: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },
  synopsis: {
    fontSize: 10.5,
    fontFamily: "Mont-500",
    lineHeight: 15,
    marginTop: 14,
    opacity: 0.7,
  },
  brandText: {
    fontSize: 9,
    fontFamily: "Mont-700",
    letterSpacing: 2,
    marginTop: 24,
    opacity: 0.3,
  },
  coverWrapper: {
    width: 115,
    aspectRatio: 2 / 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  mainCover: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  coverPlaceholder: {
    backgroundColor: "rgba(128,128,128,0.2)",
  },
  actionArea: {
    width: "100%",
    marginTop: 24,
    gap: 4,
  },
  shareBtn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#FFF",
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
  },
  shareBtnText: {
    color: "#000",
    fontFamily: "Mont-600",
    fontSize: 13,
    marginTop: 2,
  },
  closeBtn: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: "rgba(255, 255, 255, 0.63)",
    fontFamily: "Mont-600",
    fontSize: 14,
  },
});

export default NovelShareModal;
