import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

export const UTCHeader = ({
  onSave,
  mode,
}: {
  onSave: () => void;
  mode: "category" | "tag";
}) => {
  const navigation = useAppNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === "category" ? "Kategoriler" : "Etiketler"}
        </Text>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <CircleEditIcon size={16} color="#1C274C" />
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Mont-700",
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#1C274C",
    fontFamily: "Mont-600",
    fontSize: 12,
  },
});
