import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";
import { EmptyListGhost } from "@/components/StateIcons/EmptyListGhost";

export const EmptyCommentState = () => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <EmptyListGhost color={isDarkMode ? "#fbfbff" : "#444343"} size={40} />
      <View style={styles.textContainer}>
        <Text style={[styles.description, { color: theme.textPrimary }]}>
          Henüz yorum yapılmamış.
        </Text>
        <Text
          style={[
            styles.subDescription,
            { color: theme.textSecondary, opacity: 0.7 },
          ]}
        >
          İlk yorumu sen yaparak seriyi değerlendir.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    gap: 16,
  },
  ghostImage: {
    width: 44,
    height: 44,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontFamily: "Mont-600",
    fontSize: 13,
    letterSpacing: -0.3,
  },
  subDescription: {
    fontFamily: "Mont-500",
    fontSize: 11,
    letterSpacing: -0.2,
  },
});
