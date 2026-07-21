import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      <View style={styles.leftContent}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <BackArrowIcon size={22} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {mode === "category" ? "Kategoriler" : "Etiketler"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.saveButton,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.045)"
              : "rgba(15,23,42,0.035)",
          },
        ]}
        activeOpacity={0.75}
        onPress={onSave}
      >
        <CircleEditIcon size={14} color={theme.textPrimary} />
        <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
          Kaydet
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    paddingBottom: 4,
    gap: 12,
  },
  leftContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Mont-600",
  },
  saveButton: {
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 9,
  },
  saveButtonText: {
    fontFamily: "Mont-500",
    fontSize: 11,
  },
});
