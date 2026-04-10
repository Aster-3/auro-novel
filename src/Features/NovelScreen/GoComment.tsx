import { Pressable, Text, StyleSheet, View } from "react-native";
import { SmilingReplyIcon } from "@/components/icons/SmilingReplyIcon";
import { useAppTheme } from "@/hooks/useTheme";

export const GoComment = ({
  onPressWrite,
  isEmptyState = false,
}: {
  onPressWrite: () => void;
  isEmptyState?: boolean;
}) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <Pressable
      onPress={onPressWrite}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isDarkMode ? "rgba(255,255,255,0.03)" : "#f7fbff",
          borderColor: isDarkMode
            ? "rgba(255,255,255,0.05)"
            : "rgba(0,0,0,0.02)",
        },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.placeholderText, { color: theme.textSecondary }]}>
        {isEmptyState ? "İlk incelemeyi sen yaz..." : "Sen ne düşünüyorsun?"}
      </Text>
      <View style={styles.iconWrap}>
        <SmilingReplyIcon color={theme.textSecondary} size={16} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  placeholderText: {
    fontFamily: "Mont-500", // Font disiplinine sadık kaldık
    fontSize: 12.5,
    letterSpacing: -0.3,
  },
  iconWrap: {
    opacity: 0.6,
    padding: 2,
  },
  pressed: {
    opacity: 0.7,
  },
});
