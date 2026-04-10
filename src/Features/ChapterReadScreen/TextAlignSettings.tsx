import React, { useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AlignLeftIcon } from "@/components/icons/AlignLeftIcon";
import { AlignCenterIcon } from "@/components/icons/AlignCenterIcon";
import { AlignRightIcon } from "@/components/icons/AlignRightIcon";
import { AlignJustifyIcon } from "@/components/icons/AlignJustifyIcon";
import { useReaderStore } from "@/store/useReaderStore";

const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"] as const;
type TextAlign = (typeof TEXT_ALIGN_OPTIONS)[number];

const ICONS: Record<TextAlign, (color: string) => React.ReactNode> = {
  left: (color) => <AlignLeftIcon size={16} color={color} />,
  center: (color) => <AlignCenterIcon size={16} color={color} />,
  right: (color) => <AlignRightIcon size={16} color={color} />,
  justify: (color) => <AlignJustifyIcon size={16} color={color} />,
};

export const TextAlignSettings = () => {
  const { isDarkMode, setTextAlign, textAlign } = useReaderStore();

  const cardBg = isDarkMode ? "#000000" : "#ffffff";
  const primary = isDarkMode ? "#fcf3e6" : "#09244B";

  const handlePress = useCallback(
    (option: TextAlign) => setTextAlign(option),
    [setTextAlign],
  );

  return (
    <View style={[styles.container, { backgroundColor: cardBg }]}>
      {TEXT_ALIGN_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          activeOpacity={0.7}
          onPress={() => handlePress(option)}
          // StyleSheet'ten sabit style + sadece border rengi dinamik
          style={[
            styles.item,
            { backgroundColor: cardBg },
            textAlign === option && styles.itemActive,
            textAlign === option && { borderColor: primary },
          ]}
        >
          {ICONS[option](primary)}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 26,
    gap: 16,
    paddingHorizontal: 12,
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // Border her zaman var ama transparan — layout shift olmaz
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemActive: {
    // Sadece rengi değişir, borderWidth sabit kalır → layout recalculation yok
  },
});
