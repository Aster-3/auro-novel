import { useAppTheme } from "@/hooks/useTheme";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const NotificationHeader = () => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.tabsWrapper}>
      <TouchableOpacity activeOpacity={0.9} style={styles.tab}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Bildirimler
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingBottom: 4,
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 6,
  },
  text: {
    fontFamily: "Mont-700",
    fontSize: 17,
    letterSpacing: -0.2,
  },
});
