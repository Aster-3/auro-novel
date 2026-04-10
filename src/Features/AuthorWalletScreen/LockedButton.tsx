import { LockIcon } from "@/components/icons/LockIcon";
import { StyleSheet, Text, View } from "react-native";

export const LockedButton = () => {
  return (
    <View style={[styles.button]}>
      <LockIcon size={16} color="#1C274C" />
      <Text style={styles.buttonText}>Sonraki Ödeme ‘12 Gün’ Sonra</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F1F5F9",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#1C274C",
    fontSize: 10,
    fontFamily: "Mont-600",
    marginTop: 2,
  },
});
