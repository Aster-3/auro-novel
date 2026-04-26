import { Keyboard, TouchableOpacity, View, StyleSheet } from "react-native";
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

  // LibrarySearch stilindeki arka plan rengi
  const buttonBg = isDarkMode ? theme.surface : "#F1F5F9";

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleBack}
        style={[styles.backButton]}
        activeOpacity={0.7}
      >
        {/* İkon rengini temadan alması için color prop'u ekledik */}
        <BackArrowIcon color={theme.textPrimary} />
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
    paddingVertical: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchWrapper: {
    flex: 1,
  },
});
