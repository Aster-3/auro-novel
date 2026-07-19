import React, { useCallback } from "react";
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
const IS_SCROLL_MODE_DISABLED = true;

export const ScrollAndThemeSettings = () => {
  const { isDarkMode, scrollMode, setScrollMode, toggleDarkMode } =
    useReaderStore();

  const cardBg = isDarkMode ? "#000000" : "#FFFFFF";
  const primary = isDarkMode ? "#fcf3e6" : "#09244B";
  const disabledColor = isDarkMode ? "rgba(252, 243, 230, 0.35)" : "#9AA4B2";
  const currentTheme: ThemeMode = isDarkMode ? "night" : "day";
  const displayedScrollMode: ScrollMode = IS_SCROLL_MODE_DISABLED
    ? "vertical"
    : scrollMode;

  const handleScrollMode = useCallback(
    (option: ScrollMode) => setScrollMode(option),
    [setScrollMode],
  );

  const handleTheme = useCallback(
    (option: ThemeMode) => {
      if (currentTheme !== option) toggleDarkMode();
    },
    [currentTheme, toggleDarkMode],
  );

  return (
    <View style={styles.wrapper}>
      {/* Scroll modu */}
      <View
        style={[
          styles.container,
          styles.disabledContainer,
          { backgroundColor: cardBg },
        ]}
      >
        {SCROLL_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={1}
            disabled={IS_SCROLL_MODE_DISABLED}
            onPress={() => handleScrollMode(option)}
            style={[
              styles.item,
              displayedScrollMode === option
                ? { borderColor: disabledColor }
                : styles.itemInactive,
              styles.disabledItem,
            ]}
          >
            {option === "vertical" ? (
              <ScrollVerticalIcon size={16} color={disabledColor} />
            ) : (
              <ScrollHorizontalIcon size={16} color={disabledColor} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Tema */}
      <View style={[styles.container, { backgroundColor: cardBg }]}>
        {THEME_MODE_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option}
            activeOpacity={0.7}
            onPress={() => handleTheme(option)}
            style={[
              styles.item,
              currentTheme === option
                ? { borderColor: primary }
                : styles.itemInactive,
            ]}
          >
            {option === "day" ? (
              <DayIcon size={16} color={primary} />
            ) : (
              <NightIcon size={16} color={primary} />
            )}
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
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 45,
    gap: 10,
    borderRadius: 26,
    paddingHorizontal: 12,
  },
  disabledContainer: {
    opacity: 0.55,
  },
  item: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22,
    paddingVertical: 8,
    // borderWidth her zaman sabit — sadece borderColor değişir
    borderWidth: 1,
  },
  disabledItem: {
    backgroundColor: "rgba(148, 163, 184, 0.08)",
  },
  itemInactive: {
    borderColor: "transparent",
  },
});
