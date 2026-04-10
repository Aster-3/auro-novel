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
          bottom: dynamicBottom + 10,
          backgroundColor: isDarkMode ? "#07091a" : "#F8FAFC",
          shadowColor: isDarkMode ? "#000" : "#050c40",
          shadowOpacity: isDarkMode ? 0.4 : 0.15, // Karanlıkta daha tok bir gölge
        },
        styles.shadow,
        isDarkMode &&
          Platform.OS === "android" && {
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.readButton,
          { backgroundColor: isDarkMode ? "#ffffff" : "#050c40" },
        ]}
      >
        <BookReadIcon size={18} color={isDarkMode ? "#0F172A" : "white"} />
        <Text
          style={[styles.readText, { color: isDarkMode ? "#0F172A" : "white" }]}
        >
          Hemen Oku
        </Text>
      </TouchableOpacity>

      <TouchableOpacity activeOpacity={0.6} style={styles.saveButton}>
        <BookmarkIcon
          size={20}
          color={isDarkMode ? theme.textPrimary : "#050c40"}
        />
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
    left: 20,
    right: 20,
    flexDirection: "row",
    borderRadius: 22,
    padding: 6,
    alignItems: "center",
  },
  shadow: {
    ...Platform.select({
      ios: {
        // shadowColor ve shadowOpacity yukarıda dinamik yapıldı
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 16,
      },
      android: {
        elevation: 2, // Karanlık modda elevation 2 yetmez, 8 iyidir
      },
    }),
  },
  readButton: {
    flex: 2.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    paddingVertical: 15,
    gap: 8,
  },
  readText: {
    fontFamily: "Mont-600",
    fontSize: 14,
    letterSpacing: -0.2,
  },
  saveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  saveText: {
    fontFamily: "Mont-600",
    fontSize: 10,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
