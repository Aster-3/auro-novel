import React, { useMemo } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

import { AddArchiveIcon } from "@/components/icons/AddArchiveIcon";
import { BookReadIcon } from "@/components/icons/BookReadIcon";
import { InArchiveIcon } from "@/components/icons/InArchiveIcon";

import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { useAppTheme } from "@/hooks/useTheme";
import { useLibraryCheck } from "@/hooks/useLibraryCheck";
import { useToggleLibrary } from "@/hooks/useToggleLibrary";

export const NovelNavCard = ({ novelId }: { novelId: string }) => {
  const dynamicBottom = useDynamicBottom();
  const { theme, isDarkMode } = useAppTheme();

  const { data: isNovelInLibrary, isLoading } = useLibraryCheck(novelId);
  const { mutate: toggleLibrary } = useToggleLibrary(novelId);

  const colors = useMemo(
    () => ({
      containerBg: isDarkMode ? "rgb(12, 12, 22)" : "#FFFFFF",
      containerBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
      btnBg: isDarkMode ? "#FFFFFF" : "#0F172A",
      btnText: isDarkMode ? "#07091A" : "#FFFFFF",
      iconColor: isDarkMode ? "#FFFFFF" : "#0F172A",
      divider: isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0",
    }),
    [isDarkMode],
  );

  return (
    <View
      style={[
        styles.container,
        {
          bottom: dynamicBottom + 16,
          backgroundColor: colors.containerBg,
          borderColor: colors.containerBorder,
          opacity: isLoading ? 0.8 : 1,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.readButton, { backgroundColor: colors.btnBg }]}
        onPress={() => {
          // Navigasyon buraya
        }}
      >
        <BookReadIcon size={16} color={colors.btnText} />
        <Text style={[styles.readText, { color: colors.btnText }]}>
          Hemen Oku
        </Text>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      {/* SAĞ: KÜTÜPHANE ALANI (Optimistic & Animated) */}
      <TouchableOpacity
        activeOpacity={0.6}
        disabled={isLoading}
        style={styles.saveButton}
        onPress={() => toggleLibrary()}
      >
        <Animated.View
          key={isNovelInLibrary ? "in" : "add"}
          entering={ZoomIn.duration(300).springify()}
          exiting={ZoomOut.duration(200)}
          style={styles.animatedContent}
        >
          {isNovelInLibrary ? (
            <>
              <InArchiveIcon size={18} color={colors.iconColor} />
              <Text style={[styles.saveText, { color: theme.textSecondary }]}>
                Kütüphanende
              </Text>
            </>
          ) : (
            <>
              <AddArchiveIcon size={18} color={colors.iconColor} />
              <Text style={[styles.saveText, { color: theme.textSecondary }]}>
                Ekle
              </Text>
            </>
          )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 24,
    right: 24,
    flexDirection: "row",
    borderRadius: 24,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.12,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  readButton: {
    flex: 2.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 14,
    gap: 8,
  },
  readText: {
    fontFamily: "Mont-700",
    fontSize: 14,
    letterSpacing: -0.4,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 12,
  },
  saveButton: {
    flex: 1,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  saveText: {
    fontFamily: "Mont-600",
    fontSize: 7.5,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },
});
