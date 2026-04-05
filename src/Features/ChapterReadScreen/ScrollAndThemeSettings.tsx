import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { DayIcon } from "@/components/icons/DayIcon";
import { NightIcon } from "@/components/icons/NightIcon";
import { ScrollVerticalIcon } from "@/components/icons/ScrollVerticalIcon";
import { ScrollHorizontalIcon } from "@/components/icons/ScrollHorizontalIcon";
import { useReaderStore } from "@/store/useReaderStore";

const SCROLL_MODE_OPTIONS = ["vertical", "horizontal"] as const;
const THEME_MODE_OPTIONS = ["day", "night"] as const;

type ScrollMode = (typeof SCROLL_MODE_OPTIONS)[number];
type ThemeMode = (typeof THEME_MODE_OPTIONS)[number];

interface Props {
  scrollMode: ScrollMode;
  setScrollMode: (mode: ScrollMode) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

export const ScrollAndThemeSettings = ({
  scrollMode,
  setScrollMode,
  themeMode,
  setThemeMode,
}: Props) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  // Renk Karşılıkları
  const colors = {
    cardBg: isDarkMode ? "#000000" : "#FFFFFF",
    primary: isDarkMode ? "#fcf3e6" : "#09244B",
  };

  const scrollIcons = {
    vertical: <ScrollVerticalIcon size={16} color={colors.primary} />,
    horizontal: <ScrollHorizontalIcon size={16} color={colors.primary} />,
  };

  const themeIcons = {
    day: <DayIcon size={16} color={colors.primary} />,
    night: <NightIcon size={16} color={colors.primary} />,
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.alignmentContainer, { backgroundColor: colors.cardBg }]}
      >
        {SCROLL_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            style={[
              styles.alignmentItem,
              scrollMode === option && [
                styles.activeItem,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setScrollMode(option)}
          >
            {scrollIcons[option]}
          </TouchableOpacity>
        ))}
      </View>

      <View
        style={[styles.alignmentContainer, { backgroundColor: colors.cardBg }]}
      >
        {THEME_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            style={[
              styles.alignmentItem,
              themeMode === option && [
                styles.activeItem,
                { borderColor: colors.primary },
              ],
            ]}
            onPress={() => setThemeMode(option)}
          >
            {themeIcons[option]}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  alignmentContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    gap: 10,
    borderRadius: 26,
    paddingHorizontal: 12,
  },
  alignmentItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    paddingVertical: 8,
  },
  activeItem: {
    borderWidth: 1,
  },
});
