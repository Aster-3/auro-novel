import { SearchIcon2 } from "@/components/icons/SearchIcon2";
import { useAppTheme } from "@/hooks/useTheme";
import { StyleSheet, TextInput, View } from "react-native";

export const UTCSearch = ({
  searchValue,
  setSearchValue,
  mode,
}: {
  searchValue: string;
  setSearchValue: (value: string) => void;
  mode: "tag" | "category";
}) => {
  const { theme, isDarkMode } = useAppTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchWrapper,
          {
            backgroundColor: isDarkMode
              ? "rgba(255,255,255,0.035)"
              : "rgba(15,23,42,0.025)",
          },
        ]}
      >
        <SearchIcon2 color={theme.textSecondary} size={14} />
        <TextInput
          style={[styles.textInput, { color: theme.textPrimary }]}
          value={searchValue}
          onChangeText={(text) => setSearchValue(text.trimStart())}
          placeholder={mode === "tag" ? "Etiket ara..." : "Kategori ara..."}
          placeholderTextColor={theme.textSecondary}
          selectionColor={theme.accent}
          cursorColor={theme.accent}
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  textInput: {
    flex: 1,
    height: "100%",
    marginLeft: 8,
    fontSize: 12.5,
    fontFamily: "Mont-500",
    paddingVertical: 0,
  },
});
