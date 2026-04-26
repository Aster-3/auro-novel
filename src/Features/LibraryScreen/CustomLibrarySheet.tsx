import React, { useCallback, forwardRef } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";

import { AboutBookIcon } from "@/components/icons/AboutBookIcon";
import { ContinueIcon } from "@/components/icons/ContinueIcon";
import { DownArchiveIcon } from "@/components/icons/DownArchiveIcon";
import { LastActivityIcon } from "@/components/icons/LastActivityIcon";
import { ReadTimeIcon } from "@/components/icons/ReadTimeIcon";
import { RightArrowIcon } from "@/components/icons/RightArrowIcon";
import { useToggleLibrary } from "@/hooks/useToggleLibrary";
import { useAppTheme } from "@/hooks/useTheme";
import { useNovelReadingStats } from "@/hooks/useNovelReadingStats";
import { formatRelativeTime } from "@/utils/formatRelativeTime";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export interface LibrarySheetData {
  id: string;
  title: string;
  authorName?: string;
  coverImageUrl: string;
}

interface Props {
  data: LibrarySheetData | null;
}

export const CustomLibrarySheet = forwardRef<BottomSheet, Props>(
  ({ data }, ref) => {
    const insets = useSafeAreaInsets();
    const { theme, isDarkMode } = useAppTheme();
    const { mutate: toggleLibrary } = useToggleLibrary(data?.id || "");
    const { data: readingstats } = useNovelReadingStats(data?.id || "");
    const navigation = useAppNavigation();

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      stiffness: 800,
    });

    const closeSheet = useCallback(() => {
      if (ref && "current" in ref && ref.current) {
        ref.current.close();
      }
    }, [ref]);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.8}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <Portal>
        <BottomSheet
          ref={ref}
          index={-1}
          enableDynamicSizing={true}
          enablePanDownToClose={true}
          backdropComponent={renderBackdrop}
          animationConfigs={animationConfigs}
          enableOverDrag={false}
          animateOnMount={true}
          handleComponent={() => null}
          backgroundStyle={[
            styles.sheetBackground,
            { backgroundColor: isDarkMode ? "#0A0A0B" : theme.surface },
          ]}
        >
          <BottomSheetView
            style={[
              styles.contentContainer,
              { paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.heroWrapper}>
              <Image
                source={{ uri: data?.coverImageUrl }}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
                blurRadius={70}
              />
              <View style={styles.heroDarkener} />

              <View style={styles.heroContent}>
                <View style={styles.coverShadow}>
                  <Image
                    source={{ uri: data?.coverImageUrl }}
                    style={styles.mainCover}
                    contentFit="cover"
                  />
                </View>

                <View style={styles.textWrapper}>
                  <Text style={styles.titleText} numberOfLines={2}>
                    {data?.title}
                  </Text>
                  <Text style={styles.authorText}>
                    {data?.authorName || "Yazar Belirtilmemiş"}
                  </Text>

                  <View style={styles.statChip}>
                    <View style={styles.statItem}>
                      <ReadTimeIcon size={12} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.sValue}>
                        {readingstats?.totalReadTime
                          ? (readingstats.totalReadTime / 3600).toFixed(2)
                          : "0.0"}{" "}
                        Saat
                      </Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <LastActivityIcon
                        size={12}
                        color="rgba(255,255,255,0.6)"
                      />
                      <Text style={styles.sValue}>
                        {readingstats?.lastReadAt
                          ? formatRelativeTime(readingstats.lastReadAt)
                          : "Aktivite Yok"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <ActionButton
                icon={
                  <ContinueIcon
                    size={18}
                    color={isDarkMode ? "rgb(13, 4, 36)" : "#FFF"}
                  />
                }
                label="Okumaya Devam Et"
                onPress={() => {
                  closeSheet();
                  setTimeout(
                    () =>
                      navigation.navigate("ChapterRead", {
                        id: readingstats?.lastReadChapterId!,
                        chapterProgress: readingstats?.lastChapterProgress || 0,
                      }),
                    200,
                  );
                }}
                primary
                theme={theme}
                isDarkMode={isDarkMode}
              />
              <ActionButton
                icon={
                  <AboutBookIcon
                    size={18}
                    color={
                      isDarkMode ? "rgba(255,255,255,0.6)" : theme.textSecondary
                    }
                  />
                }
                label="Bu Kitap Hakkında"
                onPress={() => {
                  closeSheet();
                  setTimeout(
                    () => navigation.navigate("Novel", { id: data?.id! }),
                    200,
                  );
                }}
                theme={theme}
                isDarkMode={isDarkMode}
              />
              <ActionButton
                icon={<DownArchiveIcon size={18} color="#E11D48" />}
                label="Kütüphaneden Kaldır"
                onPress={() => {
                  closeSheet();
                  setTimeout(() => toggleLibrary(), 200);
                }}
                isDestructive
                theme={theme}
                isDarkMode={isDarkMode}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </Portal>
    );
  },
);

const ActionButton = ({
  icon,
  label,
  onPress,
  primary,
  isDestructive,
  theme,
  isDarkMode,
}: any) => {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = withSpring(pressed.value ? 0.96 : 1, {
      damping: 100,
      stiffness: 1000,
    });
    let bg;
    if (primary) {
      bg = isDarkMode ? "#FFF" : "#100f1e";
    } else {
      bg = interpolateColor(
        pressed.value,
        [0, 1],
        [
          "transparent",
          isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)",
        ],
      );
    }

    return {
      transform: [{ scale }],
      backgroundColor: bg,
      opacity: primary ? withSpring(pressed.value ? 0.9 : 1) : 1,
    };
  });

  const getLabelColor = () => {
    if (primary) return isDarkMode ? "#1d1c1c" : "#FFF";
    if (isDestructive) return "#E11D48";
    return isDarkMode ? "rgba(255,255,255,0.8)" : theme.textPrimary;
  };

  return (
    <Pressable
      onPressIn={() => (pressed.value = 1)}
      onPressOut={() => (pressed.value = 0)}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.actionRow,
          primary && styles.primaryAction,
          animatedStyle,
        ]}
      >
        <View style={styles.actionLeft}>
          {icon}
          <Text
            style={[
              styles.actionText,
              { color: getLabelColor() },
              primary && { fontFamily: "Mont-600" },
              isDestructive && { opacity: 0.9 },
            ]}
          >
            {label}
          </Text>
        </View>
        {!primary && (
          <RightArrowIcon
            size={10}
            color={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.15)"}
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  contentContainer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: "hidden",
  },
  heroWrapper: {
    height: 200,
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  heroDarkener: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10, 10, 11, 0.78)",
  },
  heroContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 5,
    paddingTop: 10,
  },
  coverShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  mainCover: { width: 105, aspectRatio: 2 / 3, borderRadius: 14 },
  textWrapper: { flex: 1, marginLeft: 20, paddingTop: 2 },
  titleText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Mont-700",
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  authorText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "Mont-500",
  },
  statChip: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statDivider: {
    width: 1,
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 10,
  },
  statItem: { flexDirection: "row", gap: 6, alignItems: "center" },
  sValue: {
    color: "#ffffffd4",
    fontSize: 9,
    fontFamily: "Mont-600",
    letterSpacing: 0.5,
  },
  body: { paddingHorizontal: 16, paddingTop: 10 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 2,
  },
  primaryAction: { marginBottom: 10, marginTop: 4 },
  actionLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  actionText: {
    fontSize: 13,
    fontFamily: "Mont-500",
  },
});
