import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı çektik

export const ChapterEditHeader = ({
  isCreating,
  handleSubmit,
  isPending,
}: {
  handleSubmit: () => void;
  isPending: boolean;
  isCreating: boolean;
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.containerLeft}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <BackArrowIcon size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {isCreating ? "Yeni Bölüm" : "Bölüm Düzenle"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: theme.surface,
            shadowColor: "#000",
            shadowOpacity: isDarkMode ? 0.3 : 0.08,
          },
          isPending && { opacity: 0.7 },
        ]}
        onPress={handleSubmit}
        disabled={isPending}
        activeOpacity={0.8}
      >
        <CircleEditIcon size={14} color={theme.textPrimary} />
        {isPending ? (
          <LoadingDots />
        ) : (
          <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
            {isCreating ? "OLUŞTUR" : "KAYDET"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10, // Biraz daha ferahlık
  },
  headerTitle: {
    fontFamily: "Mont-700", // Daha belirgin başlık
    fontSize: 16,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  saveButtonText: {
    fontFamily: "Mont-700",
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
