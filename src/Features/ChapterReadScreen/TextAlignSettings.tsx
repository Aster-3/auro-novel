import { View, StyleSheet, TouchableOpacity } from "react-native";
import { AlignLeftIcon } from "@/components/icons/AlignLeftIcon";
import { AlignCenterIcon } from "@/components/icons/AlignCenterIcon";
import { AlignRightIcon } from "@/components/icons/AlignRightIcon";
import { AlignJustifyIcon } from "@/components/icons/AlignJustifyIcon";
const TEXT_ALIGN_OPTIONS = ["left", "center", "right", "justify"] as const;

export const TextAlignSettings = ({
  textAlign,
  setTextAlign,
}: {
  textAlign: string;
  setTextAlign: (align: (typeof TEXT_ALIGN_OPTIONS)[number]) => void;
}) => {
  return (
    <View style={styles.aligmentContainer}>
      {TEXT_ALIGN_OPTIONS.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.aligmentItem,
            textAlign === option && {
              borderWidth: 1,
              borderColor: "#09244B",
            },
          ]}
          onPress={() => setTextAlign(option)}
        >
          {option === "left" && <AlignLeftIcon size={16} color={"#09244B"} />}
          {option === "center" && (
            <AlignCenterIcon size={16} color={"#09244B"} />
          )}
          {option === "right" && <AlignRightIcon size={16} color={"#09244B"} />}
          {option === "justify" && (
            <AlignJustifyIcon size={16} color={"#09244B"} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  aligmentContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 45,
    borderRadius: 26,
    gap: 16,
    paddingHorizontal: 12,
  },
  aligmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  aligmentText: {
    fontSize: 12,
    color: "#1A1A1A",
    fontFamily: "Mont-500",
  },
});
