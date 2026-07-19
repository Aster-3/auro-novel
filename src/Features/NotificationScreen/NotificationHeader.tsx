import { useAppTheme } from "@/hooks/useTheme";
import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

interface Props {
  canMarkAllAsRead?: boolean;
  onMarkAllAsRead?: () => void;
}

export const NotificationHeader = ({
  canMarkAllAsRead = false,
  onMarkAllAsRead,
}: Props) => {
  const { theme } = useAppTheme();

  return (
    <View style={styles.tabsWrapper}>
      <TouchableOpacity activeOpacity={0.9} style={styles.tab}>
        <Text style={[styles.text, { color: theme.textPrimary }]}>
          Bildirimler
        </Text>
      </TouchableOpacity>

      {canMarkAllAsRead && (
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.markReadButton}
          onPress={() => onMarkAllAsRead?.()}
        >
          <Text style={[styles.markReadText, { color: theme.textSecondary }]}>
            Tümünü okundu yap
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabsWrapper: {
    paddingBottom: 4,
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tab: {
    paddingVertical: 6,
  },
  text: {
    fontFamily: "Mont-700",
    fontSize: 17,
    letterSpacing: -0.2,
  },
  markReadButton: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  markReadText: {
    fontFamily: "Mont-600",
    fontSize: 11,
  },
});
