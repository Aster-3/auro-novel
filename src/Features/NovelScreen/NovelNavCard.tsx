import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { BookmarkIcon } from "@/components/icons/BookmarkIcon";
import { BookReadIcon } from "@/components/icons/BookReadIcon";
import { useDynamicBottom } from "@/utils/useDynamicBottom";
import { useAppTheme } from "@/hooks/useTheme";

export const NovelNavCard = () => {
  const dynamicBottom = useDynamicBottom();
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          bottom: dynamicBottom + 16,
          backgroundColor: isDarkMode ? "rgb(8, 8, 17)" : "#FFFFFF",
          borderColor: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#F1F5F9",
        },
      ]}
    >
      {/* OKU BUTONU */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.readButton,
          { backgroundColor: isDarkMode ? "#FFFFFF" : "#0F172A" },
        ]}
      >
        <BookReadIcon size={16} color={isDarkMode ? "#07091A" : "#FFFFFF"} />
        <Text
          style={[
            styles.readText,
            { color: isDarkMode ? "#07091A" : "#FFFFFF" },
          ]}
        >
          Hemen Oku
        </Text>
      </TouchableOpacity>

      {/* AYIRICI ÇİZGİ (Opsiyonel, daha teknik durur) */}
      <View
        style={[
          styles.divider,
          { backgroundColor: isDarkMode ? "rgba(255,255,255,0.1)" : "#E2E8F0" },
        ]}
      />

      {/* KAYDET BUTONU */}
      <TouchableOpacity activeOpacity={0.6} style={styles.saveButton}>
        <BookmarkIcon size={18} color={isDarkMode ? "#FFFFFF" : "#0F172A"} />
        <Text style={[styles.saveText, { color: theme.textSecondary }]}>
          Kaydet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 30,
    right: 30,
    flexDirection: "row",
    borderRadius: 20,
    padding: 8,
    alignItems: "center",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  readButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 12, // Daha ince
    gap: 6,
  },
  readText: {
    fontFamily: "Mont-700", // Daha kalın font, küçük boyutta daha iyi okunur
    fontSize: 13,
    letterSpacing: -0.3,
  },
  divider: {
    width: 1,
    height: 20,
    marginHorizontal: 10,
  },
  saveButton: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  saveText: {
    fontFamily: "Mont-800",
    fontSize: 8, // Mikro tipografi
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
