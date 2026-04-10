import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useTheme"; // Temayı ekledik

export const UTCHeader = ({
  onSave,
  mode,
}: {
  onSave: () => void;
  mode: "category" | "tag";
}) => {
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <BackArrowIcon size={24} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {mode === "category" ? "Kategoriler" : "Etiketler"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: theme.surface,
            shadowColor: "#000",
            shadowOpacity: isDarkMode ? 0.4 : 0.1,
          },
        ]}
        activeOpacity={0.8}
        onPress={onSave}
      >
        <CircleEditIcon size={14} color={theme.textPrimary} />
        <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
          KAYDET
        </Text>
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
    paddingBottom: 8,
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Mont-700",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
