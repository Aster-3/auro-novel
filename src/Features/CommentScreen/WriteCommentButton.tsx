import { WriteReviewIcon } from "@/components/icons/WriteReviewIcon";
import { Pressable, StyleSheet, View } from "react-native";
import { useAppTheme } from "@/hooks/useTheme";

export const WriteCommentButton = ({ onPress }: { onPress: () => void }) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isDarkMode ? theme.surface : "#ffffff",
          borderColor: isDarkMode ? "#333333" : "#E5E7EB",
          shadowColor: isDarkMode ? "#000000" : "#000000",
        },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.inner}>
        <WriteReviewIcon size={20} color={isDarkMode ? "#ffffff" : "#0F121B"} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 56,
    right: 28,
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  inner: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
});
