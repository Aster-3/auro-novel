import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { Text, StyleSheet, TouchableOpacity } from "react-native";

export const OverviewTitle = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.headerTitle}>{title}</Text>
      <CircleEditIcon size={20} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "Mont-600",
    letterSpacing: -0.2,
    fontSize: 16,
  },
});
