import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AlignLeftIcon } from "@/components/icons/AlignLeftIcon";
import { AlignCenterIcon } from "@/components/icons/AlignCenterIcon";
import { AlignRightIcon } from "@/components/icons/AlignRightIcon";
import { AlignJustifyIcon } from "@/components/icons/AlignJustifyIcon";
import { useReaderStore } from "@/store/useReaderStore";

const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"] as const;

export const TextAlignSettings = ({
  textAlign,
  setTextAlign,
}: {
  textAlign: string;
  setTextAlign: (align: (typeof TEXT_ALIGN_OPTIONS)[number]) => void;
}) => {
  const isDarkMode = useReaderStore((state) => state.isDarkMode);

  // Renk Karşılıkları
  const colors = {
    cardBg: isDarkMode ? "#000000" : "#ffffff",
    primary: isDarkMode ? "#fcf3e6" : "#09244B",
  };

  return (
    <View
      style={[styles.aligmentContainer, { backgroundColor: colors.cardBg }]}
    >
      {TEXT_ALIGN_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.aligmentItem,
            { backgroundColor: colors.cardBg },
            textAlign === option && {
              borderWidth: 1,
              borderColor: colors.primary,
            },
          ]}
          onPress={() => setTextAlign(option)}
        >
          {option === "left" && (
            <AlignLeftIcon size={16} color={colors.primary} />
          )}
          {option === "center" && (
            <AlignCenterIcon size={16} color={colors.primary} />
          )}
          {option === "right" && (
            <AlignRightIcon size={16} color={colors.primary} />
          )}
          {option === "justify" && (
            <AlignJustifyIcon size={16} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  aligmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 26,
    gap: 16,
    paddingHorizontal: 12,
  },
  aligmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  aligmentText: {
    fontSize: 12,
    fontFamily: "Mont-500",
  },
});
