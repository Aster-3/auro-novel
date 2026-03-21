import { WriteReviewIcon } from "@/components/icons/WriteReviewIcon";
import { Pressable, StyleSheet, View } from "react-native";

export const WriteCommentButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.inner}>
        <WriteReviewIcon size={20} color="#0F172A" />
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

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
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
