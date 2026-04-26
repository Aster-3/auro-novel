import { Pressable, StyleSheet } from "react-native";
import { BackArrowIcon } from "./icons/BackArrowIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export const BackButton = ({
  size = 26,
  color = "#FFFFFF",
}: {
  size?: number;
  color?: string;
}) => {
  const navigation = useAppNavigation();
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.6 }]}
      hitSlop={20}
    >
      <BackArrowIcon color={color} size={size} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  backButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
