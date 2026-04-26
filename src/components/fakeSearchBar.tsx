import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { SearchIcon2 } from "./icons/SearchIcon2"; // SearchIcon2 kullandım görsel uyum için
import { FilterIcon } from "./icons/FilterIcon";
import { useAppNavigation } from "../hooks/useAppNavigation";
import { useAppTheme } from "../hooks/useTheme";

export const FakeSearchBar = () => {
  const navigation = useAppNavigation();
  const { theme, isDarkMode } = useAppTheme();

  // LibrarySearch'teki arka plan mantığının aynısı
  const buttonBg = isDarkMode ? theme.surface : "#F1F5F9";

  return (
    <View style={styles.container}>
      {/* Arama Alanı (Fake TextInput) */}
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Search");
        }}
        activeOpacity={0.7}
        style={[
          styles.searchButton,
          {
            backgroundColor: buttonBg,
          },
        ]}
      >
        <View style={styles.contentWrapper}>
          <SearchIcon2 size={16} color={theme.textSecondary} />
          <Text
            style={[styles.placeholderText, { color: theme.textSecondary }]}
          >
            Search by Title
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  searchButton: {
    flex: 1,
    height: 44, // LibrarySearch yüksekliğine yakın
    borderRadius: 99, // Ovalden ziyade modern köşeli yapı
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  contentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  placeholderText: {
    fontSize: 13,
    fontFamily: "Mont-500", // Temanızdaki font ailesi
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
