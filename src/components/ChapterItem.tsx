import { Fragment, memo } from "react";
import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { LockIcon } from "./icons/LockIcon";
import { DownloadedsIcon } from "./icons/DownloadedsIcon";
import { useAppTheme } from "@/hooks/useTheme";

export const ChapterItem = memo(
  ({ chapter, index, showVolumeHeader, onNavigate }: any) => {
    // Profesyonel lige geçiş: Artık manuel renk tanımlama yok!
    const { theme, isDarkMode } = useAppTheme();

    const volumeLabel = `Cilt ${chapter.volumeOrder}${
      chapter.volumeName ? ` • ${chapter.volumeName}` : ""
    }`;

    return (
      <Fragment>
        {showVolumeHeader && (
          <View style={styles.minimalVolumeContainer}>
            <Text style={[styles.volumeText, { color: theme.textPrimary }]}>
              {volumeLabel}
            </Text>
            <View
              style={[
                styles.line,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.1)"
                    : "rgba(0, 0, 0, 0.23)",
                },
              ]}
            />
          </View>
        )}

        <Pressable
          onPress={onNavigate}
          style={({ pressed }) => [
            styles.chapterPressable,
            {
              backgroundColor: pressed
                ? isDarkMode
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)"
                : "transparent",
            },
          ]}
        >
          <View style={styles.leftContent}>
            <Text style={[styles.indexText, { color: theme.textPrimary }]}>
              {String(index + 1).padStart(2, "0")}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.chapterTitle, { color: theme.textPrimary }]}
            >
              {chapter.title}
            </Text>
          </View>

          <View style={styles.rightContent}>
            {chapter.isLocked ? (
              <View style={styles.lockWrapper}>
                <LockIcon size={17} color={theme.textSecondary} />
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.6}
                style={[
                  styles.downloadButton,
                  {
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.05)"
                      : "#F1F5F9",
                  },
                ]}
              >
                <DownloadedsIcon size={16} color={theme.accent} />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Fragment>
    );
  },
);

const styles = StyleSheet.create({
  minimalVolumeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24, // Biraz daha nefes alsın
    paddingBottom: 6,
    gap: 12,
  },
  volumeText: {
    fontFamily: "Mont-500", // Biraz daha tok
    fontSize: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  line: {
    flex: 1,
    height: 0.5,
  },
  chapterPressable: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  indexText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    width: 22,
    opacity: 0.7,
  },
  chapterTitle: {
    fontFamily: "Mont-500",
    fontSize: 13.5, // Bir tık büyütüldü, okunaklılık arttı
    letterSpacing: -0.2,
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  lockWrapper: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
