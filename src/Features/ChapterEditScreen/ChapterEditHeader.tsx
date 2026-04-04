import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const ChapterEditHeader = ({
  isCreating,
  handleSubmit,
  isPending,
}: {
  handleSubmit: () => void;
  isPending: boolean;
  isCreating: boolean;
}) => {
  const navigation = useAppNavigation();
  return (
    <View style={styles.header}>
      <View style={styles.containerLeft}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackArrowIcon size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isCreating ? "Yeni Bölüm" : "Bölüm Düzenle"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit}
        disabled={isPending}
      >
        <CircleEditIcon size={16} color="#1C274C" />
        {isPending ? (
          <LoadingDots />
        ) : (
          <Text style={styles.saveButtonText}>
            {isCreating ? "Oluştur" : "Güncelle"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontFamily: "Mont-600",
    fontSize: 16,
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
