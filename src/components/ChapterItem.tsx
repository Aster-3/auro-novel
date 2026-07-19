import { Fragment, memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useAppTheme } from "@/hooks/useTheme";
import { DownloadedsIcon } from "@/components/icons/DownloadedsIcon";
import { CheckIcon } from "@/components/icons/CheckIcon";

type DownloadStatus = "idle" | "downloading" | "downloaded";

export const ChapterItem = memo(
  ({
    chapter,
    index,
    showVolumeHeader,
    onNavigate,
    onDownload,
    downloadStatus = "idle",
  }: any & { downloadStatus?: DownloadStatus }) => {
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

          {onDownload && (
            <Pressable
              hitSlop={10}
              disabled={downloadStatus !== "idle"}
              onPress={(event) => {
                event.stopPropagation();
                onDownload(chapter);
              }}
              style={({ pressed }) => [
                styles.downloadButton,
                {
                  backgroundColor: pressed
                    ? isDarkMode
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)"
                    : "transparent",
                },
              ]}
            >
              {downloadStatus === "downloading" ? (
                <ActivityIndicator color={theme.textSecondary} size="small" />
              ) : downloadStatus === "downloaded" ? (
                <CheckIcon color={theme.accent} size={18} />
              ) : (
                <DownloadedsIcon color={theme.textSecondary} size={18} />
              )}
            </Pressable>
          )}
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
    minWidth: 0,
  },
  indexText: {
    fontFamily: "Mont-500",
    fontSize: 11,
    width: 22,
    opacity: 0.7,
  },
  chapterTitle: {
    flex: 1,
    fontFamily: "Mont-500",
    fontSize: 13.5, // Bir tık büyütüldü, okunaklılık arttı
    letterSpacing: -0.2,
  },
  downloadButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});
