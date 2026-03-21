import { Pressable, Text, StyleSheet, View } from "react-native";
import { ReplyIcon } from "@/components/icons/ReplyIcon";
import { SmilingReplyIcon } from "@/components/icons/SmilingReplyIcon";

export const GoComment = ({
  onPressWrite,
  isEmptyState = false,
}: {
  onPressWrite: () => void;
  isEmptyState?: boolean;
}) => {
  return (
    <Pressable
      onPress={onPressWrite}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <Text style={styles.placeholderText}>
        {isEmptyState
          ? "İlk yorumu yapmak ister misiniz?"
          : "Sen ne düşünüyorsun?"}
      </Text>
      <View style={styles.iconWrap}>
        <SmilingReplyIcon color="#94A3B8" size={18} />
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
    paddingVertical: 13,
    marginVertical: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E2E8F0",
    backgroundColor: "#FAFBFC",
  },
  placeholderText: {
    fontFamily: "Poppins-400",
    fontSize: 12,
    fontWeight: "500",
    color: "#B0BCCA",
    letterSpacing: -0.1,
  },
  iconWrap: {
    opacity: 0.6,
  },
  pressed: {
    backgroundColor: "#F1F5F9",
    opacity: 0.85,
  },
});
