import { BackArrowIcon } from "@/components/icons/BackArrowIcon";
import { CircleEditIcon } from "@/components/icons/CircleEditIcon";
import { LoadingDots } from "@/components/LoadingDots";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useAppTheme } from "@/hooks/useTheme";
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
  const { theme, isDarkMode } = useAppTheme();
  const navigation = useAppNavigation();

  return (
    <View style={[styles.header, { backgroundColor: theme.background }]}>
      <View style={styles.containerLeft}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.backButton}
        >
          <BackArrowIcon size={20} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {isCreating ? "Yeni Bölüm" : "Bölüm Düzenle"}
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
          isPending && { opacity: 0.7 },
        ]}
        onPress={handleSubmit}
        disabled={isPending}
        activeOpacity={0.75}
      >
        <CircleEditIcon size={14} color={theme.textPrimary} />
        {isPending ? (
          <LoadingDots />
        ) : (
          <Text style={[styles.saveButtonText, { color: theme.textPrimary }]}>
            {isCreating ? "Oluştur" : "Kaydet"}
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
    paddingVertical: 10,
    marginTop: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  containerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  backButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "Mont-600",
    letterSpacing: -0.3,
  },
  saveButton: {
    minHeight: 34,
    paddingHorizontal: 16,
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
