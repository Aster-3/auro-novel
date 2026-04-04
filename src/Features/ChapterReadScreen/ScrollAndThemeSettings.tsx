import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
// İhtiyacın olmayan ikonları ve lodash'i kaldırdım
import { AlignLeftIcon } from "@/components/icons/AlignLeftIcon";
import { AlignRightIcon } from "@/components/icons/AlignRightIcon";
import { DayIcon } from "@/components/icons/DayIcon";
import { AlignJustifyIcon } from "@/components/icons/AlignJustifyIcon"; // Gece ikonu için başka ikonun yoksa kalsın
import { NightIcon } from "@/components/icons/NightIcon";
import { ScrollVerticalIcon } from "@/components/icons/ScrollVerticalIcon";
import { ScrollHorizontalIcon } from "@/components/icons/ScrollHorizontalIcon";

// Tipleri tanımlayalım
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
  // İkonları bir nesne içinde tutmak JSX'i daha temiz hale getirir
  const scrollIcons = {
    vertical: <ScrollVerticalIcon size={16} color={"#09244B"} />,
    horizontal: <ScrollHorizontalIcon size={16} color={"#09244B"} />,
  };

  const themeIcons = {
    day: <DayIcon size={16} color={"#09244B"} />,
    night: <NightIcon size={16} color={"#09244B"} />, // Buraya uygun bir NightIcon koymanı öneririm
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.alignmentContainer}>
        {SCROLL_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            style={[
              styles.alignmentItem,
              scrollMode === option && styles.activeItem,
            ]}
            onPress={() => setScrollMode(option)}
          >
            {scrollIcons[option]}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.alignmentContainer}>
        {THEME_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            style={[
              styles.alignmentItem,
              themeMode === option && styles.activeItem,
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
    backgroundColor: "#FFFFFF",
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
    borderColor: "#09244B",
  },
});
