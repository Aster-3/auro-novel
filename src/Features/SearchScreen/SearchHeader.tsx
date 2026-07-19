import { Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";
import { BackArrowIcon } from "../../components/icons/BackArrowIcon";
import { SearchBar } from "../../components/searchBar";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppTheme } from "../../hooks/useTheme";

export const SearchHeader = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (val: string) => void;
}) => {
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  const handleBack = () => {
    Keyboard.dismiss();
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("Main");
    }
  };

  const controlBg = isDarkMode ? theme.surface : "#F8FAFC";
  const borderColor = isDarkMode ? "rgba(255,255,255,0.08)" : "#E5E7EB";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleBack}
        style={[styles.backButton, { backgroundColor: controlBg, borderColor }]}
        activeOpacity={0.72}
      >
        <BackArrowIcon size={20} color={theme.textPrimary} />
      </TouchableOpacity>

      <View style={styles.searchWrapper}>
        <SearchBar value={value} setValue={setValue} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flex: 1,
  },
});
