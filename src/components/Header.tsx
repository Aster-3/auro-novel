import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { BackButton } from "./BackButton";
import { useAppTheme } from "@/hooks/useTheme";

export const Header = ({
  title,
  isAdjacent,
}: {
  title: string;
  isAdjacent: boolean;
}) => {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        isAdjacent
          ? { justifyContent: "flex-start", gap: 12 }
          : { justifyContent: "space-between" },
      ]}
    >
      {/* BackButton rengini de temadan alıyoruz */}
      <BackButton color={theme.textPrimary} size={22} />

      <View style={styles.titleWrapper}>
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Denge sağlamak için sağ taraf boşluğu */}
      {!isAdjacent && <View style={styles.rightSection} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 52,
    paddingHorizontal: 4,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1, // Uzun başlıkların taşmasını önler
  },
  title: {
    fontSize: 16,
    fontFamily: "Mont-600",
    letterSpacing: -0.3,
    includeFontPadding: false,
  },
  rightSection: {
    width: 22,
    height: 22,
  },
});
